# CharterLab — Монгол компанийн дүрэм үүсгэгч

React + Vite дээр суурилсан, Компанийн тухай хуулийн 16 дугаар зүйлд тулгуурлан компанийн дүрмийн анхан шатны төсөл үүсгэх веб апп.

## Local development
1. Node.js 18+ суулгана.
2. Төслийн хавтсанд терминал нээнэ.
3. `npm install`
4. `npm run dev`

## GitHub-д оруулах
```bash
git init
git add .
git commit -m "Initial CharterLab app"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## Vercel-д deploy хийх
1. https://vercel.com руу GitHub-аар нэвтэрнэ.
2. Add New → Project → GitHub repository сонгоно.
3. Framework Preset: Vite (автоматаар танигдана).
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy дарна.

`vercel.json` нь SPA route rewrite тохиргоог агуулна.

## Анхаарах зүйл
Одоогийн хувилбар нь хэрэглэгчийн оруулсан мэдээллээр Word (.docx) файл үүсгэдэг MVP. Энэ нь хууль зүйн эцсийн дүгнэлт эсвэл улсын бүртгэлийн баталгаатай загвар биш. Дүрмийн заалт, компанийн төрөл, тусгай зөвшөөрөл, компанийн засаглал, хувьцааны бүтэц болон ахмадын сангийн зохицуулалтыг хуульч шалгаж баталгаажуулах шаардлагатай. Хуулийн өөрчлөлтийг тогтмол шинэчилнэ.
