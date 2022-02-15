////////////////
// STIMULI
///////////////

// Item types
const PRACTICE = "PRACTICE";
const TARGET = "TARGET";

// name for lists, in this case one list, one item in the list
const LISTS = ["default"];

// In case of more complex design, the above could be, for example:

// const LISTS = [
//     "my_first_list",
//     "my_second_list"
// ];

const PRACTICE_ITEMS = [
    {
        id: 1, item_type: TARGET, image: './img/prac1_kr.png',
        sound: './sounds/prac1_kr.wav',
    },
];

const LIST_1 = [
];

const TEST_ITEMS = [
    {list_name: LISTS[0], table: LIST_1}
];

// If there were two lists to choose from:

// const TEST_ITEMS = [
//     {list_name: LISTS[0], table: LIST_1},
//     {list_name: LISTS[1], table: LIST_2}
// ];

/**
 * Get the list of practice items
 *
 * Returns an object with a list and a table, the list will always indicate
 * "practice" since it are the practice items
 *
 * @returns {object} object with list and table fields
 */
function getPracticeItems() {
    return {list_name : "practice", table : PRACTICE_ITEMS};
}

/**
 * This function will pick a random list from the TEST_ITEMS array.
 * @returns {object} object with one or more "lists" and table fields
 */
function pickRandomList() {
    let range = function (n) {
        let empty_array = [];
        let i;
        for (i = 0; i < n; i++) {
            empty_array.push(i);
        }
        return empty_array;
    }
    let num_lists = TEST_ITEMS.length;
    var shuffled_range = jsPsych.randomization.repeat(range(num_lists), 1);
    var retlist = TEST_ITEMS[shuffled_range[0]];
    return retlist;
}
