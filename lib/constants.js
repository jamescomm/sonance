const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 1
}
const ACCOUNT_LEVEL = {
    ADMIN : 1,
    NORMAL_USER : 0
}
const DB_MODEL_REF = {
    USER : "user",
}


const MESSAGES = {
    intrnlSrvrErr: "Please try after some time.",
    unAuthAccess: "Unauthorized access ",
    tokenGenError: "Error while generating access token",
    invalidEmail: "Please fill valid Email Address",
    invalidMobile: "Please fill valid Mobile No",
    blockedMobile: "Action Blocked for Illegal use of Services.",
    invalidOtp: "Invalid OTP",
    nameCantEmpty: "Name can't be empty",
    invalidNum: "Please fill valid phone number or Do not add country code",
    passCantEmpty: "Password can't be empty",
    validationError : "Validation errors",
    incorrectPass: "Invalid email or passoword",
    userNotFound: "User not found.",
    accessTokenCantEmpty: "Access token cannot be empty",
    tokenSecretCantEmpty: "Secret token cannot be empty",
    deviceIdCantEmpty : "Device id cannot be empty",
    platformCantEmpty : "Platform cannot be empty or invalid",
    deviceTokenCantEmpty : "Device token cannot be empty",
    ACCOUNT_DEACTIVATED: "Your account is suspended, please contact the exchange admin: exchangeadmin@exchange.com.",
}


module.exports = Object.freeze({
    APP_NAME: 'exchanges',
    TOKEN_EXPIRATION_TIME : 60 * 24 * 60, // in mins - 60 days
    STATUS_CODE: STATUS_CODE,
    ACCOUNT_LEVEL : ACCOUNT_LEVEL,
    DB_MODEL_REF: DB_MODEL_REF,
    MESSAGES : MESSAGES,
    email : {
        //Credentials
        SENDER : 'alerts@exchanges.com',
        TOKEN_SEPARATOR  : '#&$',

        //constants
        OTP : '[OTP]',
        LINK : '[LINK]',
        TOKEN : '[TOKEN]',
        REASON : '[REASON]',
        POSTMESSAGE : '[POSTMESSAGE]',
        PAGEMESSAGE : '[PAGEMESSAGE]',
        USERMESSAGE : '[USERMESSAGE]',
        MEDIA : '[MEDIA]',

        subject : {
            OTP_EMAIL : 'Exchanges : One Time Password',
            VERIFY_EMAIL : 'Confirm Email Address',
            FORGOT_PWD : 'Reset Password',
            FUND_REFIL_MAIL: 'Exchanges: Refil your Funds',
            PROMOTION_STOPPED_MAIL: "Exchanges: Promotion Stopped",
            POST_DEACTIVATED_MAIL: 'Exchanges: Post Deactivated',
            PAGE_DEACTIVATED_MAIL: 'Exchanges: Page Deactivated',
            USER_DEACTIVATED_MAIL: 'Exchanges: Account Deactivated',
        },
        //Predefined Mail Templates
        templates : {

            //Verification Mail
            OTP_EMAIL : "<html>\
                Your One Time Password for Login into Exchanges is : [OTP]\
                <br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                </html>"
            ,
            FUND_REFIL_MAIL : "<html>\
                Ypur Account Funds are Lower then $30. Please Refil your account.\
                <br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                </html>"
            ,

            POST_DEACTIVATED_MAIL : "<html>\
                Your Post has been Deactivated by Admin because [REASON].\
                <br/><b>Your Post Message:</b> [POSTMESSAGE]\
                <br/><b>Your Media Files:</b><br/> [MEDIA]\
                <br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                </html>"
            ,

            PROMOTION_STOPPED_MAIL : "<html>\
                Your Promotion has been Stopped by Admin because [REASON].\
                <br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                </html>"
            ,


            VERIFY_EMAIL : "<html>\
                Click to confirm exchange ID Connect: [LINK]\
                <br/>Ignore this email if it was not requested.<br/><br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                </html>"
            ,

            FORGET_PWD_EMAIL : " <html>\
                Click to reset passwod : [LINK]\
                <br/>Ignore this email if it was not requested.<br/><br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                "
            ,
            PAGE_DEACTIVATED_MAIL : "<html>\
                Your Page is deactivated because [REASON], please contact the exchange admin: exchangeadmin@exchange.com.\
                <br/><b>Page Username:</b> [PAGEMESSAGE]\
                <br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                </html>"
            ,
            USER_DEACTIVATED_MAIL : "<html>\
                Your account is suspended because [REASON], please contact the exchange admin: exchangeadmin@exchange.com.\
                <br/><b>Username:</b> [USERMESSAGE]\
                <br/><br/>\
                Thank you,\
                <br/>Exchanges Team.\
                <br/>This e-mail message is intended only for the named recipient(s) above and is covered by the\
                Electronic Communications Privacy Act 18 U.S.C. Section 2510-2521. This e-mail is confidential and may\
                contain information that is privileged or exempt from disclosure under applicable law.\
                If you have received this message in error please immediately notify the sender by return e-mail and delete\
                this e-mail message from your computer, mobile devices and any cloud storage backup systems as well as\
                destroy any printed copy you might have made.\
                </html>"
            ,

        }
    },

    sms : {
        OTP : '[OTP]',
        KEY : '[KEY]',
        PHONE : '[PHONE]',
        templates : {
            VERIFY_PHONE : '[OTP] is Your One Time Password for Mobile [PHONE] to your Exchanges Account.\
                \n Regards, \n Exchanges Team',
        }
    },
    account_deactivate_sms : {
        USERNAME : '[USERNAME]',
        REASON : '[REASON]',
        templates : {
            MSG : 'Your account (username- [USERNAME]) is suspended because [REASON], please contact the Exchanges admin: exchangesadmin@exchanges.com.',
        }
    },
    masterOtpKey : 1234
});