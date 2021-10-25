const mongoose = require('mongoose')
const dicSchema = mongoose.Schema({ // 스키마 정의
    r_seq: { type: String, trim: true },
    r_word: { type: String, required: true, trim: true },
    r_link: { type: String, required: true, trim: true },
    r_chi: { type: String, trim: true },
    r_des: { type: String, trim: true },
    r_pos: { type: String, trim: true }
}, { collection: 'kor_dic_coll' })

const Dic = mongoose.model('Dic', dicSchema) // 스키마로부터 생성된 모델 객체
module.exports = Dic;