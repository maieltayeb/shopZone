/** @type {import('tailwindcss').Config} */
export default {
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  //      ↑
  // ** = كل الفولدرات جوا src
  // *.{js,jsx} = كل ملفات js و jsx
  // يعني مش ممكن تنسى ملف ✅
],
  theme: {
    extend: {},
  },
  plugins: [],
}
// Tailwind في الأصل CSS ضخم جداً — الـ content هو اللي بيخليه خفيف عن طريق إنه يشيل اللي مش بتستخدمه 
// Tailwind → بيفتح ملفاتك
// بيدور على → text-blue-500 لقاها ✅
//            → bg-red-500 ملقهاش ❌
// بيشيل اللي ملقهاش
// النتيجة → 10kb بس ✅
