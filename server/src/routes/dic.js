const express = require('express') 
const DicRouter = express.Router() 
const Dic = require("../models/Dic");

DicRouter.route('/auto/(:word)?').get( async (req, res) => {
    let words = []
    const { word } = req.params
    console.log(req.params.word)

    if(word !== undefined && word !== "undefined"){
        try{
            words = await Dic.distinct('r_word', { r_word: { $regex: `^${word}`}})
            //words = await Dic.distinct('r_word', { r_word: new RegExp('^'+word)})
        }catch(e){ 
            console.log(e) 
        }             
    }else{
        //words = ['none']
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
            //words = [ { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", }, { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", } ]

        }catch(e){ 
            console.log(e) 
        }             
    }else{
        //res.send("전체단어")
        try{
            words = await Dic.find().sort({r_word:1,r_seq:1})
            //words = [ { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", }, { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", }, { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", }, { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", }, { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", }, { r_seq: "1", r_word: "학원", r_link: "https//google.com", r_chi: "한자", r_des: "학원은 지루하다", r_pos: "포스", } ]

        }catch(e){ 
            console.log(e) 
        }            
    }
    res.json({ status:200, words})
})

module.exports = DicRouter