// Properties
var Properties = process.env || {};

// constants
//Properties.SPREADSHEET_NAME = '';
//Properties.SECTIONS_WORKSHEET_NAME = '';
//Properties.TASKS_WORKSHEET_NAME = '';
//Properties.TAKSLOGS_WORKSHEET_NAME = '';
//Properties.USERNAME = '';
//Properties.PASSWORD = '';

Properties.LOCAL_DATA_REFRESH = 60000;
Properties.GOOGLE_DRIVE_LOG = false;
Properties.SERVER_APP_LOG = false;

// constants

// export
module.exports = Properties;