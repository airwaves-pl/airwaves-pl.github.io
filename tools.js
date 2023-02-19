const EMPTY_STRING = '';
const NEW_LINE = new RegExp('\r?\n');
const QUOTES_COMMA_SEMICOLON_TAB_SPACE = new RegExp('"|\'|,|;|\\t', 'g');

const app = new Vue({
    el: '#app',
    data: {
        sourceList: '',
        targetList: '',
        rightJoin: [],
        leftJoin: [],
        innerJoin: [],
        repetitiveItems: '',
        duplicates: [],
        findDuplicatesClicked: false,
        keywords: '',
        replacement: '',
        textToCheck: '',
        occurred: [],
        notOccurred: []
    },
    computed: {
        showWarnings: function () {
            return {
                'show-right-join': this.rightJoin.length > 0,
                'show-left-join': this.leftJoin.length > 0,
                'show-inner-join': this.innerJoin.length > 0,
                'show-duplicates': this.duplicates.length > 0,
                'show-no-duplicates': this.duplicates.length == 0 && this.findDuplicatesClicked,
                'show-occurred': this.occurred.length > 0,
                'show-not-occurred': this.notOccurred.length > 0
            }
        },
        rightJoinClass: function () {
            return {
                'alert-danger': this.rightJoin.length > 0,
                'alert-success': this.rightJoin.length == 0
            }
        },
        leftJoinClass: function () {
            return {
                'alert-danger': this.leftJoin.length > 0,
                'alert-success': this.leftJoin.length == 0
            }
        }
    },
    methods: {
        compareLists() {
            const sourceSet = new Set();
            const targetSet = new Set();

            this.sourceList
                .trim()
                .replace(QUOTES_COMMA_SEMICOLON_TAB_SPACE, EMPTY_STRING)
                .split(NEW_LINE)
                .forEach(item => sourceSet.add(item));
            this.targetList
                .trim()
                .replace(QUOTES_COMMA_SEMICOLON_TAB_SPACE, EMPTY_STRING)
                .split(NEW_LINE)
                .forEach(item => targetSet.add(item));

            this.rightJoin = Array.from(targetSet)
                .filter(item => item !== EMPTY_STRING && !sourceSet.has(item));
            this.leftJoin = Array.from(sourceSet)
                .filter(item => item !== EMPTY_STRING && !targetSet.has(item));
            this.innerJoin = Array.from(targetSet)
                .filter(item => item !== EMPTY_STRING && sourceSet.has(item));
        },
        findDuplicates() {
            const itemCountMap = new Map();
            this.duplicates = [];

            this.repetitiveItems
                .trim()
                .replace(QUOTES_COMMA_SEMICOLON_TAB_SPACE, EMPTY_STRING)
                .split(NEW_LINE)
                .filter(item => item !== EMPTY_STRING)
                .forEach(item => {
                    let previousValue = itemCountMap.get(item);
                    itemCountMap.set(item, typeof previousValue === 'undefined' ? 1 : ++previousValue);
                });

            itemCountMap.forEach((value, key) => {
                if (value > 1) {
                    this.duplicates.push(key);
                }
            });

            this.findDuplicatesClicked = true;
        },
        findOccurrences() {
            const itemOccurrenceMap = new Map();
            this.occurred = [];
            this.notOccurred = [];

            this.keywords
                .trim()
                .replace(QUOTES_COMMA_SEMICOLON_TAB_SPACE, EMPTY_STRING)
                .split(NEW_LINE)
                .filter(keyword => keyword !== EMPTY_STRING)
                .forEach(keyword => {
                    const regexp = new RegExp(keyword);
                    const found = regexp.test(this.textToCheck);
                    itemOccurrenceMap.set(keyword, found);
                });

            itemOccurrenceMap.forEach((value, key) => {
                if (value) {
                    this.occurred.push(key);
                } else {
                    this.notOccurred.push(key);
                }
            });
        },
        findAndReplaceOccurrences() {
            const itemOccurrenceMap = new Map();
            this.occurred = [];
            this.notOccurred = [];

            this.keywords
                .replace(QUOTES_COMMA_SEMICOLON_TAB_SPACE, EMPTY_STRING)
                .split(NEW_LINE)
                .filter(keyword => keyword !== EMPTY_STRING)
                .forEach(keyword => {
                    const regex = new RegExp(keyword, 'g');
                    const found = regex.test(this.textToCheck);
                    const replace = typeof this.replacement === 'undefined' ? EMPTY_STRING : this.replacement; 
                    this.textToCheck = this.textToCheck.replace(regex, replace);
                    itemOccurrenceMap.set(keyword, found);
                });

            itemOccurrenceMap.forEach((value, key) => {
                if (value) {
                    this.occurred.push(key);
                } else {
                    this.notOccurred.push(key);
                }
            });
        }
    }
});
