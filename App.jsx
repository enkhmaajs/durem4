import React, { useMemo, useState } from 'react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

const initial = {
  fullName:'', shortName:'', legalForm:'Хязгаарлагдмал хариуцлагатай компани', address:'',
  purpose:'', activities:'', capital:'', authorizedShares:'', issuedShares:'', shareType:'Энгийн хувьцаа',
  nominalValue:'', preferred:'Үгүй', preferredCount:'', preferredRights:'',
  hasBoard:'Үгүй', boardCount:'', shareholderPowers:'', boardPowers:'',
  elderFund:'Байгуулна', elderFundAmount:'', founders:'', executiveTitle:'Гүйцэтгэх захирал'
}
const sections = [
 ['basic','01','Ерөнхий мэдээлэл','Компанийн нэр, хэлбэр, хаяг'],
 ['capital','02','Хувь нийлүүлсэн хөрөнгө','Хувьцаа болон хөрөнгийн бүтэц'],
 ['governance','03','Компанийн засаглал','Хурал, ТУЗ, гүйцэтгэх удирдлага'],
 ['activity','04','Үйл ажиллагаа','Зорилго ба үйл ажиллагааны чиглэл'],
 ['additional','05','Нэмэлт зохицуулалт','Ахмадын сан болон бусад мэдээлэл']
]
export default function App(){
 const [data,setData]=useState(initial), [step,setStep]=useState(0), [done,setDone]=useState(false)
 const update=(k,v)=>setData(p=>({...p,[k]:v}))
 const missing=useMemo(()=>!data.fullName.trim()||!data.shortName.trim()||!data.address.trim()||!data.activities.trim()||!data.capital.trim()||!data.authorizedShares.trim()||!data.issuedShares.trim()||!data.nominalValue.trim(),[data])
 const Field=({label,name,placeholder='',type='text',hint=''})=><label className="field"><span>{label}</span><input type={type} value={data[name]} placeholder={placeholder} onChange={e=>update(name,e.target.value)}/>{hint&&<small>{hint}</small>}</label>
 const Area=({label,name,placeholder='',hint=''})=><label className="field"><span>{label}</span><textarea rows="3" value={data[name]} placeholder={placeholder} onChange={e=>update(name,e.target.value)}/>{hint&&<small>{hint}</small>}</label>
 const Select=({label,name,options})=><label className="field"><span>{label}</span><select value={data[name]} onChange={e=>update(name,e.target.value)}>{options.map(x=><option key={x}>{x}</option>)}</select></label>
 function buildText(){
  const d=data
  const lines=[
   `“${d.fullName}” ${d.legalForm.toLowerCase()}-ийн дүрэм`,
   'НЭГ. НИЙТЛЭГ ҮНДЭСЛЭЛ',
   `1.1. Компанийн бүрэн оноосон нэр: ${d.fullName}.`,
   `1.2. Компанийн товчилсон оноосон нэр: ${d.shortName}.`,
   `1.3. Компанийн хэлбэр: ${d.legalForm}.`,
   `1.4. Компанийн оршин байгаа газрын хаяг: ${d.address}.`,
   `1.5. Компанийн үйл ажиллагааны зорилго: ${d.purpose||'Хууль тогтоомжид нийцүүлэн ашиг олох'}.`,
   'ХОЁР. ХУВЬ НИЙЛҮҮЛСЭН ХӨРӨНГӨ, ХУВЬЦАА',
   `2.1. Компанийн хувь нийлүүлсэн хөрөнгийн хэмжээ: ${d.capital}.`,
   `2.2. Зарласан хувьцааны тоо: ${d.authorizedShares}.`,
   `2.3. Гаргасан хувьцааны тоо: ${d.issuedShares}.`,
   `2.4. Хувьцааны төрөл: ${d.shareType}. Нэгж хувьцааны нэрлэсэн үнэ: ${d.nominalValue}.`,
   ...(d.preferred==='Тийм'?[`2.5. Давуу эрхийн хувьцааны зарласан тоо: ${d.preferredCount||'Тодорхойлоогүй'}.`,`2.6. Давуу эрхийн хувьцаа эзэмшигчийн эрх: ${d.preferredRights||'Хувьцаа гаргах шийдвэр болон холбогдох хуульд нийцүүлэн тодорхойлно'}.`]:['2.5. Компани давуу эрхийн хувьцаа зарлаагүй болно.']),
   'ГУРАВ. КОМПАНИЙН УДИРДЛАГА',
   `3.1. Компанийн эрх барих дээд байгууллага нь хувьцаа эзэмшигчдийн хурал байна.`,
   `3.2. Хувьцаа эзэмшигчдийн хурлын хуулиар тогтоосноос бусад бүрэн эрх: ${d.shareholderPowers||'Нэмэлт бүрэн эрх тусгайлан тогтоогоогүй.'}.`,
   ...(d.hasBoard==='Тийм'?[`3.3. Компани ${d.boardCount||'___'} гишүүнтэй Төлөөлөн удирдах зөвлөлтэй байна.`,`3.4. ТУЗ-ийн хуулиар тогтоосноос бусад бүрэн эрх: ${d.boardPowers||'Нэмэлт бүрэн эрх тусгайлан тогтоогоогүй.'}.`]:['3.3. Компани Төлөөлөн удирдах зөвлөлгүй байна.']),
   `3.${d.hasBoard==='Тийм'?'5':'4'}. Компанийн гүйцэтгэх удирдлагыг ${d.executiveTitle} хэрэгжүүлнэ.`,
   'ДӨРӨВ. ҮЙЛ АЖИЛЛАГААНЫ ЧИГЛЭЛ',
   `4.1. Компанийн үйл ажиллагааны чиглэл: ${d.activities}.`,
   'ТАВ. АХМАДЫН САН БОЛОН БУСАД ЗОХИЦУУЛАЛТ',
   `5.1. Ахмадын сан: ${d.elderFund}.`,
   `5.2. Ахмадын санд төвлөрүүлэх мөнгөн хөрөнгийн хэмжээ: ${d.elderFundAmount||'Холбогдох шийдвэрээр тогтооно'}.`,
   '5.3. Энэхүү дүрэмд тусгагдаагүй асуудлыг Монгол Улсын Компанийн тухай хууль болон бусад холбогдох хууль тогтоомжоор зохицуулна.',
   'ЗУРГАА. ҮҮСГЭН БАЙГУУЛАГЧ / ХУВЬЦАА ЭЗЭМШИГЧ',
   `6.1. Үүсгэн байгуулагч / хувьцаа эзэмшигч: ${d.founders||'________________________________'}.`,
   '',
   'БАТАЛСАН: ҮҮСГЭН БАЙГУУЛАГЧ / ХУВЬЦАА ЭЗЭМШИГЧДИЙН ШИЙДВЭРЭЭР',
   'Огноо: ____ оны ____ сарын ____ өдөр',
   'Гарын үсэг: ______________________________'
  ]
  return lines
 }
 async function download(){
  const lines=buildText()
  const children=lines.map((line,i)=>new Paragraph({
   alignment:i===0?AlignmentType.CENTER:AlignmentType.LEFT,
   spacing:{after:i===0?300:130},
   heading:i===0?HeadingLevel.TITLE:undefined,
   children:[new TextRun({text:line||' ',bold:i===0||/^(НЭГ|ХОЁР|ГУРАВ|ДӨРӨВ|ТАВ|ЗУРГАА)\./.test(line),size:i===0?30:22,font:'Arial'})]
  }))
  const doc=new Document({sections:[{properties:{page:{margin:{top:1200,right:1200,bottom:1200,left:1500}}},children}]})
  const blob=await Packer.toBlob(doc); saveAs(blob,`${data.shortName||'company'}-durem.docx`)
  setDone(true)
 }
 const renderFields=()=>{
  if(step===0)return <><div className="grid"><Field label="Компанийн бүрэн оноосон нэр *" name="fullName" placeholder="Жишээ: ABC Монгол ХХК"/><Field label="Товчилсон оноосон нэр *" name="shortName" placeholder="Жишээ: ABC"/></div><div className="grid"><Select label="Компанийн хэлбэр" name="legalForm" options={['Хязгаарлагдмал хариуцлагатай компани','Хувьцаат компани']}/><Field label="Улсын бүртгэлд бүртгүүлэх хаяг *" name="address" placeholder="Аймаг/хот, дүүрэг, хороо, байр"/></div><Area label="Үүсгэн байгуулагч / хувьцаа эзэмшигч" name="founders" placeholder="Нэр, регистр эсвэл хуулийн этгээдийн нэр (шаардлагатай мэдээллийг оруулна уу)"/></>
  if(step===1)return <><Field label="Хувь нийлүүлсэн хөрөнгийн хэмжээ *" name="capital" placeholder="Жишээ: 10,000,000 төгрөг"/><div className="grid"><Field label="Зарласан хувьцааны тоо *" name="authorizedShares" placeholder="1000 ширхэг"/><Field label="Гаргасан хувьцааны тоо *" name="issuedShares" placeholder="1000 ширхэг"/></div><div className="grid"><Select label="Хувьцааны төрөл" name="shareType" options={['Энгийн хувьцаа','Энгийн болон давуу эрхийн хувьцаа']}/><Field label="Нэгж хувьцааны нэрлэсэн үнэ *" name="nominalValue" placeholder="10,000 төгрөг"/></div><Select label="Давуу эрхийн хувьцаа зарлах уу?" name="preferred" options={['Үгүй','Тийм']}/>{data.preferred==='Тийм'&&<><Field label="Давуу эрхийн хувьцааны зарласан тоо" name="preferredCount"/><Area label="Эзэмшигчийн эрх" name="preferredRights" placeholder="Ногдол ашиг, хөрөнгө хуваарилалт зэрэг эрхийг тодорхойлно"/></>}</>
  if(step===2)return <><Select label="Төлөөлөн удирдах зөвлөлтэй байх уу?" name="hasBoard" options={['Үгүй','Тийм']}/>{data.hasBoard==='Тийм'&&<><Field label="ТУЗ-ийн гишүүдийн тоо" name="boardCount" placeholder="Жишээ: 5"/><Area label="ТУЗ-ийн нэмэлт бүрэн эрх" name="boardPowers" placeholder="Хуулиар тогтоосноос бусад бүрэн эрх"/></>}<Area label="Хувьцаа эзэмшигчдийн хурлын нэмэлт бүрэн эрх" name="shareholderPowers" placeholder="Хуулиар тогтоосноос бусад бүрэн эрх"/><Select label="Гүйцэтгэх удирдлагын албан тушаал" name="executiveTitle" options={['Гүйцэтгэх захирал','Ерөнхий захирал','Гүйцэтгэх удирдлагын баг']}/></>
  if(step===3)return <><Area label="Үйл ажиллагааны чиглэл *" name="activities" placeholder="Жишээ: Худалдаа, үйлчилгээ, импорт, экспорт..." hint="Тусгай зөвшөөрөл шаарддаг үйл ажиллагааг холбогдох зөвшөөрөлтэйгөөр эрхэлнэ."/><Area label="Компанийн үйл ажиллагааны зорилго" name="purpose" placeholder="Ашиг олох болон хуульд нийцсэн бусад зорилго"/></>
  return <><Select label="Ахмадын сан байгуулах" name="elderFund" options={['Байгуулна']}/><Field label="Ахмадын сангийн мөнгөн хөрөнгийн хэмжээ" name="elderFundAmount" placeholder="Мөнгөн дүн эсвэл тогтоох аргачлал" hint="Хуулийн шаардлагыг хангах байдлаар шийдвэр, дүрэмд тодорхой тусгана."/></>
 }
 return <div className="shell"><header><a className="brand" href="#"><span className="brandmark">CL</span><span>Charter<span className="accent">Lab</span><small>LEGAL DOCUMENT AUTOMATION</small></span></a><span className="topnote">MONGOLIAN COMPANY LAW · ART. 16</span></header>
 <main><section className="intro"><div className="eyebrow">ХУУЛЬ + ТЕХНОЛОГИ</div><h1>Компанийн дүрмээ<br/><em>хялбархан</em> боловсруул.</h1><p>Хэдхэн алхмаар мэдээллээ оруулаад, компанийн дүрмийн төслийг Word форматаар үүсгээрэй.</p><div className="intro-meta"><span>✦ Монгол хэл дээр</span><span>✦ Word файл</span><span>✦ Хуулийн шаардлагын checklist</span></div></section>
 <section className="workspace"><aside className="steps"><div className="steps-title">БҮРТГЭЛИЙН ЯВЦ</div>{sections.map((s,i)=><button key={s[0]} className={`step ${step===i?'active':''} ${step>i?'passed':''}`} onClick={()=>setStep(i)}><span className="num">{step>i?'✓':s[1]}</span><span><b>{s[2]}</b><small>{s[3]}</small></span></button>)}<div className="law-note"><b>Хуулийн үндэслэл</b><p>Компанийн тухай хуулийн 16.2.1–16.2.8 дахь заалтууд.</p><a href="https://legalinfo.mn/mn/detail?lawId=310" target="_blank" rel="noreferrer">Хуулийг харах ↗</a></div></aside>
 <div className="formpanel"><div className="paneltop"><span>АЛХАМ 0{step+1} / 05</span><span>{Math.round((step+1)/5*100)}% дууссан</span></div><div className="progress"><i style={{width:`${(step+1)*20}%`}}/></div><h2>{sections[step][2]}</h2><p className="sub">{sections[step][3]} — талбаруудыг үнэн зөв бөглөнө үү.</p><div className="fields">{renderFields()}</div><div className="actions"><button className="back" disabled={step===0} onClick={()=>setStep(s=>s-1)}>← Буцах</button>{step<4?<button className="next" onClick={()=>setStep(s=>s+1)}>Үргэлжлүүлэх <span>→</span></button>:<button className="next" onClick={download}>Word файл үүсгэх ↓</button>}</div>{done&&<div className="success">✓ Word файл бэлэн боллоо. Татсан файлаа шалгаж, дутуу мэдээллийг нэмж баталгаажуулна уу.</div>}</div></section>
 <section className="disclaimer"><span>ⓘ</span><p><b>Анхаарах нь:</b> Энэхүү систем нь анхан шатны дүрмийн төсөл үүсгэнэ. Бөглөсөн мэдээлэл, хувьцааны бүтэц, засаглалын зохицуулалтыг хуульч хянан баталгаажуулах шаардлагатай. Ялангуяа компанийн төрөл, ТУЗ-ийн бүтэц болон бусад тусгай шаардлагыг тусад нь шалгана.</p></section></main><footer><span>© 2026 CharterLab</span><span>Built for Mongolian legal workflows</span></footer></div>
}