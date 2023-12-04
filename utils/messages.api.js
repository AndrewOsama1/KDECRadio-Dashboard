const messages = {
    server:{
        internalError: {
            en: "Internal server error",
            ar: "يوجد عطل بالنظام"
        },
        notFound: {
            en: "Not Found",
            ar: "غير موجود"
        }
    },
    category: {
        notFound: {
            en: "Category not found",
            ar: "القسم غير متوفر"
        },
        noCategories: {
            en: "There is no categories",
            ar: "لا توجد اقسام"
        },
        isEmpty: {
            en: "This category is empty",
            ar: "هذا القسم فارغ"
        }
    },
    album: {
        notFound: {
            en: "Album not found",
            ar: "الالبوم غير متوفر"
        },
        isEmpty: {
            en: "This album is empty",
            ar: "هذا الالبوم فارغ"
        }
    },
    song: {
        notFound: {
            en: "Song not found",
            ar: "لم يتم العثور على الاغنية"
        },
        noSongs: {
            en: "There are no songs",
            ar: "لا توجد أغاني"
        }
    },
    user: {
        notFound: {
            en: "User not found",
            ar: "لا وجود لهذا المستخدم"
        },
        missingInputs: {
            en: "There is a missing input(s)",
            ar: "هناك مدخلات مفقودة"
        },
        couldntAdd: {
            en: "Coudln't add user",
            ar: "تعذر إضافة مستخدم"
        },
        couldntUpdate: {
            en: "Coudln't update user",
            ar: "تعذر تعديل المستخدم"
        },
        couldntRemove: {
            en: "Coudln't remove user",
            ar: "تعذر إزالة المستخدم"
        },
        couldntExport: {
            en: "Coudln't export list",
            ar: "تعذر استخراج القائمة"
        },
        noContnet: {
            en: "There is no contnet to update on this request",
            ar: "لا يوجد محتوى لتحديثه بناء على هذا الطلب"
        },
    },
    notification: {
        noNotifications: {
            en: "There is no notifications",
            ar: "لا توجد اشعارات"
        },
        missingInputs: {
            en: "There is a missing input(s)",
            ar: "هناك مدخلات مفقودة"
        },
        couldntAdd: {
            en: "Coudln't add notification",
            ar: "تعذر إضافة اشعار"
        }
    },
    auth: {
        noToken: {
            en: "You don\'t have access!,\nPlease login to continue",
            ar: "ليس لديك صلاحية، بالرجائ تسجيل الدخول"
        },
        wrongToken: {
            en: "You don\'t have access!,\nPlease login to continue",
            ar: "ليس لديك صلاحية، بالرجائ تسجيل الدخول"
        },
        invalidToken: {
            en: "You don\'t have access!,\nPlease login to continue",
            ar: "ليس لديك صلاحية، بالرجائ تسجيل الدخول"
        }
    },
    storage: {
        fileNotFound: {
            en: "File not found",
            ar: "الملف ليس موجود"
        }
    }
}

/**
 * 
 * @param {"server.internalError" |
* "category.notFound" |
* "category.noCategories" |
* "category.isEmpty" |
* "album.notFound" |
* "album.isEmpty" |
* "song.noSongs" |
* "song.notFound" |
* "user.notFound" |
* "user.missingInputs" |
* "user.couldntAdd" |
* "user.couldntUpdate" |
* "user.couldntRemove" |
* "user.couldntExport" |
* "user.noContent" |
* "notification.noNotifications" |
* "notification.missingInputs" |
* "notification.couldntAdd" |
* "auth.noToken" |
* "auth.wrongToken" |
* "auth.invalidToken" |
* "storage.fileNotFound" |
* "server.notFound" } messageName 
 * @param {"en" | "ar"} language 
 * @returns { string }
 */
const apiMessage = (messageName, language = 'en') => {
    let message
    if (messageName.includes('.')) {
        let [object, key] = messageName.split('.')
        message = messages[object][key][language]
    } else message = messages[messageName][language]
    return message
}

module.exports = apiMessage
