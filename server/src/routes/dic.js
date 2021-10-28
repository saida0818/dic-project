const express = require('express') 
const DicRouter = express.Router() 
const Dic = require("../models/Dic");

/*
DicRouter.get('/', async (req, res) => { 
    // res.send('all dic list') 
    const dics = await Dic.find()
    //console.log(dics) 
    res.json({status:200, dics})
}) 

DicRouter.get('/:id', (req, res) => { 
    //res.send(`dic ${req.params.id}`) 
    Dic.findById(req.params.id, (err, dic) => { 
        if(err) throw err; 
        res.json({ status: 200, dic}) 
    })    
})
*/
DicRouter.route('/auto/(:word)?').get( async (req, res) => {
    let words = []
    const { word } = req.params
    console.log(req.params.word)

    if(word !== undefined && word !== "undefined"){
        try{
            //words = await Dic.distinct('r_word', { r_word: { $regex: `^${word}`}})
            words = await Dic.distinct('r_word', { r_word: new RegExp('^'+word)})
        }catch(e){ 
            console.log(e) 
        }             
    }else{
        words = ['none']
    }
    res.json({ status:200, words})
})

DicRouter.route('/(:word)?').get( async (req, res) => {
    let words = []
    const { word } = req.params
    console.log(req.params.word)

    if(word !== undefined && word !== "undefined"){
        //res.send("특정단어")
        try{
            //words = await Dic.find({ r_word: word}).sort({r_word:1,r_seq:1})
            //words = await Dic.find({ r_word: { $regex: `^${word}`}}) // 검색어로 시작하는 단어
            //words = await Dic.find({ r_word: { $regex: `${word}$`}}) // 검색어로 끝나는 단어
            //words = await Dic.find({ r_des: { $regex: `${word}`}}) // 검색어로 포함된 단어
            words = await Dic.find({
                $or: [
                    {r_word: { $regex: `${word}`}},
                    {r_des: { $regex: `${word}`}}
                ]
            }).sort({r_word:1,r_seq:1}) // sort : -1=최신순(내림), 1=과거순(오름)
            .limit(6) // 조회갯수 설정

            //words = await Dic.find({ r_des: {$in:[{ $regex: '법규'},{ $regex: '계속'}]}})
        }catch(e){ 
            console.log(e) 
        }             
    }else{
        //res.send("전체단어")
        try{
            words = await Dic.find().sort({r_word:1,r_seq:1})
        }catch(e){ 
            console.log(e) 
        }            
    }
    res.json({ status:200, words})
})

// DicRouter.post('/', (req, res) => { 
//     res.send(`dic ${req.body.name} created`) 
// })

DicRouter.put('/:id', (req, res) => { 
   // res.send(`dic ${req.params.id} updated`) 
   Dic.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, dic) => { 
       if(err) throw err; 
       res.json({ status: 204, msg: `dic ${req.params.id} updated in db !`, dic}) 
    })   
})

DicRouter.delete('/:id', (req, res) => { 
    // res.send(`dic ${req.params.id} updated`) 
    Dic.findByIdAndRemove(req.params.id, (err, dic) => { 
        if(err) throw err; 
        res.json({ status: 204, msg: `dic ${req.params.id} removed in db !`}) 
     })   
 })

DicRouter.post('/', (req, res) => { 
    console.log(`r_word: ${req.body.r_word}`) 
    Dic.findOne({ r_word: req.body.r_word, r_link: req.body.r_link }, async (err, dic) => { // 중복체크 
        if(err) throw err; 
        if(!dic){ // 데이터베이스에서 해당 사전을 조회하지 못한 경우 
            const newDic = new Dic(req.body); 
            await newDic.save().then( () => { 
                res.json({ status: 201, msg: 'new dic created in db !', newDic}) 
            }) 
        }else{ // 생성하려는 사전과 같은 이름이고 아직 끝내지 않은 사전이 이미 데이터베이스에 존재하는 경우 
            const msg = 'this dic already exists in db !' 
            console.log(msg) 
            res.json({ status: 204, msg}) 
        } 
    }) 
})


module.exports = DicRouter