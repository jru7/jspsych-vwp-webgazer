////////////////
// GLOBALS
///////////////

// ACCESS_KEY needs to be used for server setup (data store)
const ACCESS_KEY = '00000000-0000-0000-0000-000000000000';

//RANDOMIZATION

// Whether or not to pseudorandomize the test items
const PSEUDO_RANDOMIZE = true;
// The maximum number of items with a similar itemtype in a row
const MAX_SUCCEEDING_ITEMS_OF_TYPE = 2;

// Default behavior of (sub) trial phases.
const FIXCROSS_DURATION = 1000;
const DEFAULT_ITI = 500;
const RESPONSE_TIMEOUT_DURATION = 2000;
const FEEDBACK_DURATION = 1000;

// Defaults for buttons
const OK_BUTTON_TEXT = "OK";
const YES_BUTTON_TEXT = "Yes";
const NO_BUTTON_TEXT = "No";
const TRUE_BUTTON_TEXT = "True";
const FALSE_BUTTON_TEXT = "False";

// Default restrictions of minimal browser dimensions
const MIN_WIDTH = 800;
const MIN_HEIGHT = 600;

// Bail out string for mobiles
const BAIL_OUT_MOBILE_TEXT = "Please run this experiment on a PC or Laptop."

// Set this to true if you want participants to click on the calibration points
// during the calibration phase:
const CALIBRATION_CLICK = false;

// Used to set the location of the points used for calibration and validation.
// The coordinates are in screen percentage, e.g. [50, 50] corresponds to the middle of the screen.
const CALIBRATION_POINTS =  [[25,25],[75,25],[50,50],[25,75],[75,75]];

// For more calibration options, look for the 'calibrate' trial in main.js
// and the jsPsych documentation: https://www.jspsych.org/7.1/plugins/webgazer-calibrate/
