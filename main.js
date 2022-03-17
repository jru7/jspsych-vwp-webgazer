let jsPsych = initJsPsych({
    override_safe_mode : true,
    extensions: [
        {type: jsPsychExtensionWebgazer}
    ],
    exclusions: {
        min_width: MIN_WIDTH,
        min_height: MIN_HEIGHT
    },
    on_finish: function() {
        uil.saveData(ACCESS_KEY);
    }
});

let preload = {
    type: jsPsychPreload,
    images: [],
}

let browser_data = {
    type: jsPsychCallFunction,
    func: () => {uil.browser.getResolutionInfo()}
};

let enter_fullscreen = {
    type: jsPsychFullscreen,
    fullscreen_mode: true
}

let sound_test_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
                <p>We will now play a test sound</p>
             `,
    choices: ['Got it'],
}

let camera_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
                <p>In order to participate you must allow the experiment to use your camera.</p>
                <p>You will be prompted to do this on the next screen.</p>
                <p>If you do not wish to allow use of your camera, you cannot participate in this experiment.<p>
                <p>It may take up to 30 seconds for the camera to initialize after you give permission.</p>
             `,
    choices: ['Got it'],
}

let init_camera = {
    type: jsPsychWebgazerInitCamera
}

let calibration_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
                <p>Now you'll calibrate the eye tracking, so that the software can use the image of your eyes to predict where you are looking.</p>
                <p>You'll see a series of dots appear on the screen. Look at each dot as it appears.</p>
             `,
    choices: ['Got it'],
}

let calibration = {
    type: jsPsychWebgazerCalibrate,
    calibration_points: [
        [25,25],[75,25],[50,50],[25,75],[75,75]
        /* [50, 50] */
    ],
    repetitions_per_point: 2,
    randomize_calibration_order: true,
    calibration_mode: 'view',
}

let validation_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
                <p>Now we'll measure the accuracy of the calibration.</p>
                <p>Look at each dot as it appears on the screen.</p>
             `,
    choices: ['Got it'],
    post_trial_gap: 1000
}

let validation = {
    type: jsPsychWebgazerValidate,
    validation_points: [
        [25,25],[75,25],[50,50],[25,75],[75,75]
        /* [50, 50] */
    ],
    roi_radius: 200,
    time_to_saccade: 1000,
    validation_duration: 2000,
    show_validation_data: true,
    data: {
        task: 'validate'
    }
}

let recalibrate_instructions = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
                <p>The accuracy of the calibration is a little lower than we'd like.</p>
                <p>Let's try calibrating one more time.</p>
                <p>On the next screen, look at the dots and click on them.<p>
             `,
    choices: ['OK'],
}

let hide_dot = {
    type: jsPsychCallFunction,
    func: function() {
        jsPsych.extensions["webgazer"].hidePredictions();
    }
}

let recalibrate = {
    timeline: [hide_dot, recalibrate_instructions, calibration, validation_instructions, validation, hide_dot],
    conditional_function: function(){
        let validation_data = jsPsych.data.get().filter({task: 'validate'}).values()[0];
        return validation_data.percent_in_roi.some(function(x){
            let minimum_percent_acceptable = 50;
            return x < minimum_percent_acceptable;
        });
    },
    data: {
        phase: 'recalibration'
    }
}

let calibration_done = {
    type: jsPsychHtmlButtonResponse,
    stimulus: `
                <p>Great, we're done with calibration!</p>
             `,
    choices: ['OK']
}

let begin_practice = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Instructions for the practice phase go here</p>
                        <p>Press any key to start.</p>`
}

let begin_test = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `<p>Instructions for the test phase go here</p>
                        <p>Press any key to start.</p>`
}


let trial = {
    type: jsPsychAudioKeyboardResponse,
    stimulus: jsPsych.timelineVariable('sound'),
    prompt: () => '<img id="image-stimulus" src="'+jsPsych.timelineVariable('image')+'"/>',
    choices: "NO_KEYS",
    trial_duration: 5000,
    extensions: [
        {
            type: jsPsychExtensionWebgazer,
            params: {targets: ['#image-stimulus']}
        }
    ],
}


let start_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function() {
        return "<div class='instruction' >" +
            "<p>Initial instructions go here</p></div>";
    },
    choices: [OK_BUTTON_TEXT],
    response_ends_trial: true
};

let end_experiment = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus : '<p>This is the end of the experiment</p>',
    choices : [],
    on_load: function() {
        if (consent_given) {
            uil.saveData();
        }
        else {
            document.body.innerHTML = FINISHED_NO_CONSENT;
        }
    }
};


function getTimeline(stimuli) {
    let timeline = [];

    timeline.push(preload);
    timeline.push(start_screen);

    timeline.push(consent_procedure);
    timeline.push(survey_procedure);

    timeline.push(sound_test_instructions);
    timeline.push(test_audio_looped);

    timeline.push(browser_data);
    timeline.push(camera_instructions);
    timeline.push(init_camera);
    timeline.push(enter_fullscreen);

    timeline.push(calibration_instructions);
    timeline.push(calibration);
    timeline.push(validation_instructions);
    timeline.push(validation);
    timeline.push(hide_dot);
    timeline.push(recalibrate);
    timeline.push(calibration_done);

    timeline.push(begin_practice);
    let practice = {
        timeline: [
            trial
        ],
        timeline_variables: getPracticeItems().table,
        randomize_order: false,
    };
    timeline.push(practice);

    timeline.push(begin_test);
    let test = {
        timeline: [
            trial,
        ],
        timeline_variables: stimuli.table
    }
    timeline.push(test);

    timeline.push(end_experiment);

    return timeline;
}

function main() {
    // Make sure you have updated your key in globals.js
    uil.setAccessKey(ACCESS_KEY);
    uil.stopIfExperimentClosed();

    // Option 1: client side randomization:
    let stimuli = pickRandomList();
    kickOffExperiment(stimuli, getTimeline(stimuli));

    // Option 2: server side balancing:
    // Make sure you have matched your groups on the dataserver with the
    // lists in stimuli.js..
    // This experiment uses groups/lists list1, and list2 by default (see
    // stimuli.js).
    // Hence, unless you change lists here, you should created matching
    // groups there.
    // uil.session.start(ACCESS_KEY, (group_name) => {
    //     let stimuli = findList(group_name);
    //     kickOffExperiment(stimuli, getTimeline(stimuli));
    // });
}

// this function will eventually run the jsPsych timeline
function kickOffExperiment(stimuli, timeline) {

    let subject_id = uil.session.isActive() ?
        uil.session.subjectId() : jsPsych.randomization.randomID(8);
    let test_items = stimuli.table;
    let list_name = stimuli.list_name;

    if (PSEUDO_RANDOMIZE) {
        let shuffled = uil.randomization.randomizeStimuli(
            test_items,
            max_same_type=MAX_SUCCEEDING_ITEMS_OF_TYPE
        );
        if (shuffled !== null)
            test_items = shuffled;
        else
            console.error('Unable to shuffle stimuli according constraints.')
    }

    // data one would like to add to __all__ trials, according to:
    // https://www.jspsych.org/overview/data/
    jsPsych.data.addProperties (
        {
            subject : subject_id,
            list : list_name,
        }
    );

    // Start jsPsych when running on a Desktop or Laptop style pc.
    uil.browser.rejectMobileOrTablet();
    jsPsych.run(timeline);
}
