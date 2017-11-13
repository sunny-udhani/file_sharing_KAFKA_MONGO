exports.req_topic_names = {
    REGISTER: 'register_request',
    LOGIN: 'login_request',
    LOGOUT: 'logout_request',
    LIST_FILES: {
        USER_FILES: 'list_files_request',
        SHARED_FILES: 'shared_files_request'
    },
    UPLOAD_FILES: 'upload_files_request',
    SET_UPLOAD_PATH: 'setuploadpath_request',
    GET_USER_DETAILS: 'getUserDetails_request',
    INSERT_SHARE_DETAILS: 'insertShareDetails_request',
    MAKE_DIRECTORY: 'makeDirectory_request',
    SAVE_DIRECTORY: 'saveDirectory_request',
    STAR_FILE: 'starFile_request',
    CREATE_GROUP: 'creategroup_request',
    ADD_MEMBERS_GROUP: 'addMembers_request',
    GROUP_SHARE_FILE_UPLOAD: 'groupShareFileUpload_request',
    LIST_GROUPS: 'listGroups_request',
    LIST_GROUP_FILES: 'listGroupFiles_request',
    LIST_GROUP_MEMBERS: 'listGroupMembers_request',
};

exports.res_topic_names = {
    REGISTER: 'register_response',
    LOGIN: 'login_response',
    LOGOUT: 'logout_response',
    LIST_FILES: {
        USER_FILES: 'list_files_response',
        SHARED_FILES: 'shared_files_response'
    },
    UPLOAD_FILES: 'upload_files_response',
    SET_UPLOAD_PATH: 'setuploadpath_response',
    GET_USER_DETAILS: 'getUserDetails_response',
    INSERT_SHARE_DETAILS: 'insertShareDetails_response',
    MAKE_DIRECTORY: 'makeDirectory_response',
    SAVE_DIRECTORY: 'saveDirectory_response',
    STAR_FILE: 'starFile_response',
    CREATE_GROUP: 'creategroup_response',
    ADD_MEMBERS_GROUP: 'addMembers_response',
    GROUP_SHARE_FILE_UPLOAD: 'groupShareFileUpload_response',
    LIST_GROUPS: 'listGroups_response',
    LIST_GROUP_FILES: 'listGroupFiles_response',
    LIST_GROUP_MEMBERS: 'listGroupMembers_response',
};