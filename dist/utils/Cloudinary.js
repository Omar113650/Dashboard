"use strict";
// استدعاء مكتبة Cloudinary لإدارة الصور والملفات
const cloudinary = require("cloudinary");
const streamifier = require("streamifier");
require("dotenv").config();
// تهيئة إعدادات Cloudinary باستخدام متغيرات البيئة
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
/**
//  * دالة لرفع ملف إلى Cloudinary
//  * @param {string} FileToUpload - مسار الملف أو بياناته لرفعه
//  * @returns {Promise<Object|Error>} - بيانات الرفع أو الخطأ في حالة الفشل
//  */
const cloudinaryUploadImage = async (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: "auto" }, (error, result) => {
            if (result)
                resolve(result);
            else
                reject(error);
        });
        streamifier.createReadStream(buffer).pipe(stream);
    });
};
/**
//  * دالة لحذف ملف من Cloudinary باستخدام الـ Public ID
//  * @param {string} ImagePublic - الـ Public ID الخاص بالملف داخل Cloudinary
//  * @returns {Promise<Object|Error>} - بيانات الحذف أو الخطأ في حالة الفشل
//  */ //
const cloudinaryRemoveImage = async (ImagePublic) => {
    try {
        const data = await cloudinary.uploader.destroy(ImagePublic);
        return data;
    }
    catch (error) {
        return error;
    }
};
// to do
// دي بتستقبل مصفوفة من الـ Public IDs وتستخدم delete_resources لحذفهم دفعة واحدة.
// ✅ لازم تتأكد إنك بتستخدم cloudinary.v2 هنا (زي ما عملت)، وده صح.
const cloudinaryRemoveMultipleImage = async (PublicIds) => {
    try {
        const result = await cloudinary.v2.api.delete_resources(PublicIds);
        return result;
    }
    catch (error) {
        return error;
    }
};
// تصدير الدوال لاستخدامها في ملفات أخرى
module.exports = {
    cloudinaryUploadImage,
    cloudinaryRemoveImage,
    cloudinaryRemoveMultipleImage,
};
