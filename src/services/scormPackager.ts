import JSZip from 'jszip';

export async function generateScormZipPackage(studentName: string, score: number, status: string): Promise<Blob> {
  const zip = new JSZip();

  // 1. imsmanifest.xml
  const imsmanifest = `<?xml version="1.0" standalone="no" ?>
<manifest identifier="Manteq_G10_Lesson1_SCORM" version="1.2"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.imsglobal.org/xsd/imsmd_rootv1p2p1 imsmd_rootv1p2p1.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
    <lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1">
      <general>
        <title>
          <langstring xml:lang="fa">منطق پایه دهم - درس نخست: منطق، ترازوی اندیشه</langstring>
        </title>
        <description>
          <langstring xml:lang="fa">بسته آموزشی تعاملی و بازی‌وارسازی شده درس ۱ منطق دهم بر پایه استاندارد اسکورم ۱.۲</langstring>
        </description>
        <keyword>
          <langstring xml:lang="fa">منطق</langstring>
          <langstring xml:lang="fa">پایه دهم</langstring>
          <langstring xml:lang="fa">تصور و تصدیق</langstring>
          <langstring xml:lang="fa">مغالطه</langstring>
        </keyword>
      </general>
    </lom>
  </metadata>
  <organizations default="manteq_org_default">
    <organization identifier="manteq_org_default">
      <title>دوره آموزشی منطق و مباحث آن (درس ۱)</title>
      <item identifier="item_lesson_1" identifierref="res_lesson_1">
        <title>درس ۱: منطق ترازوی اندیشه</title>
        <adlcp:masteryscore>70</adlcp:masteryscore>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="res_lesson_1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
      <file href="scormdriver.js" />
    </resource>
  </resources>
</manifest>`;

  zip.file('imsmanifest.xml', imsmanifest);

  // 2. scormdriver.js
  const scormdriver = `/**
 * SCORM 1.2 Runtime Adapter
 */
var nFindAPITries = 0;
var maxTries = 10;

function ScanForAPI(win) {
  while ((win.API == null) && (win.parent != null) && (win.parent != win)) {
    nFindAPITries++;
    if (nFindAPITries > maxTries) return null;
    win = win.parent;
  }
  return win.API;
}

function GetAPI(win) {
  if ((win.parent != null) && (win.parent != win)) {
    return ScanForAPI(win.parent);
  }
  if (win.opener != null) {
    return ScanForAPI(win.opener);
  }
  return null;
}

window.SCORM_INIT = function() {
  var api = GetAPI(window);
  if (api) {
    api.LMSInitialize("");
    api.LMSSetValue("cmi.core.lesson_status", "incomplete");
    api.LMSCommit("");
  }
};
`;
  zip.file('scormdriver.js', scormdriver);

  // 3. index.html wrapper
  const wrapperHtml = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="utf-8">
  <title>بسته اسکورم درس ۱ منطق دهم</title>
  <script src="scormdriver.js"></script>
</head>
<body style="margin:0;padding:0;background:#090d16;color:#fff;font-family:sans-serif;">
  <div style="padding:24px;text-align:center;">
    <h2>بسته آموزشی استاندارد اسکورم (SCORM 1.2)</h2>
    <p>درس ۱ منطق دهم: ترازوی اندیشه</p>
    <p>دانش‌آموز: ${studentName || 'دانش‌آموز دهم'} | وضعیت: ${status} | نمره: ${score}٪</p>
    <hr style="border-color:#334155;margin:20px auto;max-width:600px;" />
    <p>برای شروع به نشانی وب اپلیکیشن اصلی مراجعه کنید یا این پکیج را در LMS بارگذاری فرمایید.</p>
  </div>
</body>
</html>`;
  zip.file('index.html', wrapperHtml);

  // 4. metadata JSON
  const meta = {
    title: 'درس اول منطق دهم - منطق ترازوی اندیشه',
    standard: 'SCORM 1.2 & 2004',
    createdDate: new Date().toISOString(),
    studentName,
    finalScore: score,
    lessonStatus: status,
    targetGrade: 'پایه دهم متوسطه (۱۶-۱۷ سال)',
  };
  zip.file('scorm_metadata.json', JSON.stringify(meta, null, 2));

  return await zip.generateAsync({ type: 'blob' });
}
