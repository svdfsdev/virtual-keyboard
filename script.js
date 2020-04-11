'use strict';

const buttons = [["Backquote", "`", "ё", "~"], ["Digit1", "1", "1", "!"], ["Digit2", "2", "2", "@", "\""],
                    ["Digit3", "3", "3", "#", "№"], ["Digit4", "4", "4", "$", ";"], ["Digit5", "5", "5", "%", "%"],
                    ["Digit6", "6", "6", "^", ":"], ["Digit7", "7", "7", "&", "?"], ["Digit8", "8", "8", "*", "*"],
                    ["Digit9", "9", "9", "(", "("], ["Digit0", "0", "0", ")", ")"], ["Minus", "-", "-", "_"],
                    ["Equal", "=", "=", "+",], ["Backspace", "Backspace", "Backspace"], ["Tab", "Tab", "Tab"], ["KeyQ", "q", "й"],
                    ["KeyW", "w", "ц"], ["KeyE", "e", "у"], ["KeyR", "r", "к"],
                    ["KeyT", "t", "е"], ["KeyY", "y", "н"], ["KeyU", "u", "г"],
                    ["KeyI", "i", "ш"], ["KeyO", "o", "щ"], ["KeyP", "p", "з"],
                    ["BracketLeft", "[", "{", "х", "Х"], ["BracketRight", "]", "ъ", "}"],
                    ["Backslash", "\\", "\\", "|", "/"], ["Delete", "Del", "Del"], ["CapsLock", "CapsLock", "CapsLock"],
                    ["KeyA", "a", "ф"], ["KeyS", "s", "ы"],
                    ["KeyD", "d", "в"], ["KeyF", "f", "а"], ["KeyG", "g", "п"],
                    ["KeyH", "h", "р"], ["KeyJ", "j", "о"], ["KeyK", "k", "л"],
                    ["KeyL", "l", "д"], ["Semicolon", ";", "ж", ":"], ["Quote", "\'", "э", "\""],
                    ["Enter", "Enter", "Enter"], ["ShiftLeft", "Shift", "Shift"], ["KeyZ", "z", "я"], ["KeyX", "x", "ч"],
                    ["KeyC", "c", "с"], ["KeyV", "v", "м"], ["KeyB", "b", "и"],
                    ["KeyN", "n", "т"], ["KeyM", "m", "ь"], ["Comma", ",", "б", "<"],
                    ["Period", ".", "ю", ">"], ["Slash", "/", ".", "?", ","], ["ArrowUp", "&#8593;",  "&#8593;"], ["ControlLeft", "Ctrl",  "Ctrl"],
                    ["MetaLeft", "Win", "Win"], ["AltLeft", "Alt", "Alt"], ["Space", " ", " ", " ", " "], ["ArrowLeft", "&#8592;",  "&#8592;"], 
                    ["ArrowDown", "&#8595;",  "&#8595;"], ["ArrowRight", "&#8594;", "&#8594;"]
                    ];

const alt = "Alt";
const ctrl = "Control";
const shift = "ShiftLeft";
const tab = "Tab";
const caps = "CapsLock";
const space = 'Space';
const enter = 'Enter';
const arrowLeft = 'ArrowLeft';
const arrowRight = 'ArrowRight';
const arrowUp = 'ArrowUp';
const arrowDown = 'ArrowDown';
const del = 'Delete';
const backspace = 'Backspace';

createPage();

const KEYBORD = document.querySelector('.keybord');
const EDITOR = document.querySelector('#text-box');
const buttonCollection = new Map();

let language = localStorage.language || 'en';

localStorage.setItem('language', language);

createButtonsCollection();

createKeybord();

EDITOR.focus();

EDITOR.addEventListener("blur", event => {
    event.target.focus();
});

//------------------------------------------------------------------------------------------
document.addEventListener('keydown', event => {

    let physicalButton = KEYBORD.querySelector('#' + event.code);

    if (buttonCollection.has( event.code )) {
        activeButtonOn(physicalButton);
    }

    if ( event.shiftKey && event.key === alt ) {
        changeLanguage();
        capsLock();
    }

    if ( event.code === shift && !event.repeat ) {
        showShiftLetters("Shift");
        capsLock();
    }

    if ( event.code ===  tab) {
        event.preventDefault();
        inputText('    ');
    }

});

//------------------------------------------------------------------------------------------
document.addEventListener('keyup', event => {

    let physicalButton = KEYBORD.querySelector('#' + event.code);
    
    if (buttonCollection.has( event.code )) {
        activeButtonOff(physicalButton);
    }

    if ( event.code === caps ) {
        capsLock();
    }

    if ( event.code === shift ) {
        showShiftLetters("");
        capsLock();
    }
});

//------------------------------------------------------------------------------------------
KEYBORD.addEventListener('mousedown', event => {
    
    if (event.target.classList.value === 'keybord') {
        event.preventDefault();        
    } else {

        activeButtonOn(event.target);

        switch (event.target.id) {
            case shift:
                showShiftLetters("Shift");
                capsLock();
                break;
            case caps:
                capsLock();
                break;
            case tab:
                inputText('    ');
                break;
            case space:
                inputText(' ');
                break;
            case enter:
                inputText('\n');
                break;
            case arrowLeft:
                cursorLeftRight(-1);
                break;
            case arrowRight:    
                cursorLeftRight(1);
                break;
            case del:
                delet(1);
                break;
            case backspace:
                delet(-1);
                break;
            case arrowUp:
            case arrowDown:
            default:
                inputText(event.target.innerText);
                break;
        }
    }
});

KEYBORD.addEventListener('mouseup', event => {

    activeButtonOff(event.target);
    switch (event.target.id) {
        case shift:
            showShiftLetters("");
            capsLock();
            break;   
        default:
            break;
    }

});

//------------------------------------------------------------------------------------------
function createPage() {
    document.body.insertAdjacentHTML('beforeend',
    `<textarea name="" id="text-box" placeholder="Input text please..."></textarea>
                                  <div class="keybord"></div>
                                  <div class="info">Переключение языка : Shift + Alt<br>Выполнено в Win 10</div>`);
}

function createButtonsCollection() {
    for (const iter of buttons) {
        buttonCollection.set(iter[0],
            {
                en: iter[1],
                ru: iter[2],
                enShift: iter[3],
                ruShift: iter[4],
            }
        );
    }
}

function createKeybord() {

    for (let i = 0; i < buttons.length; i++) {
        KEYBORD.insertAdjacentHTML('beforeend', '<div class="button" id="' + buttons[i][0] + '">' + buttonContent(buttons[i][0], '') + '</div>');
    }
}

function activeButtonOn(button) {
    
    button.classList.add('active');

}

function activeButtonOff(button) {
    button.classList.remove('active');
}

function inputText(text) {
    
    EDITOR.value += text;
}

function buttonContent(element, shift ) {

    let language = localStorage.getItem('language');

    return buttonCollection.get(element)[language + shift];
}

function changeLanguage() {
    localStorage.language = (localStorage.getItem('language') === 'en') ? 'ru' : 'en';

    KEYBORD.innerHTML = '';
    createKeybord();
}

function showShiftLetters(mode) {
    let regexp = /Backquote|Digit|Minus|Equal|Bracket|Backslash|Semicolon|Quote|Comma|Period|Slash/gi;    

    for (const button of KEYBORD.children) {
        if ( button.id.match(regexp) ) {

            let text = buttonCollection.get(button.id)[localStorage.language + mode] || buttonCollection.get(button.id)["en" + mode];
            
            button.innerText = text;
        }
    }
}

function capsLock() {
    let regexp = /Quote|Key|BracketRight|Semicolon|Comma|Period/gi;

    for (const button of KEYBORD.children) {
        if ( button.id.match(regexp) ) {

            if (button.classList.value.includes('uppercase')) {
                button.classList.remove('uppercase');
            } else {
                button.classList.add('uppercase');                
            }

        }
    }
}

function cursorLeftRight(position) {
    EDITOR.selectionStart += position;
    EDITOR.selectionEnd = EDITOR.selectionStart;     
}

function delet(param) {

    let start = EDITOR.selectionStart;
    let end = EDITOR.selectionEnd;

    if (start != end) {
        EDITOR.setRangeText('', start, end, 'start');        
    } else if (param == 1) {
        EDITOR.setRangeText('', start, end + 1, 'start');
    } else if (param == -1) {
        EDITOR.setRangeText('', start - 1, end, 'start');
    }

}