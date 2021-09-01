import SmartComponent from '../smart-component.js';
import {emotions} from '../utils/const.js';

const Keys = {
  META: 'Meta',
  ENTER: 'Enter',
  CTRL: 'Control',
};

const CallbackTypes = {
  SUBMIT: 'submit',
  CHANGE: 'change',
};

const createEmojiItem = (emoji) =>
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>
`;

const createNewCommentTemplate = ({emotion, comment, isEmotion}) =>
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${isEmotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
    </label>

    <div class="film-details__emoji-list">
      ${emotions.map(createEmojiItem).join('')}
    </div>
  </div>
`;

export default class NewComment extends SmartComponent {
  constructor() {
    super();
    this._data = NewComment.parseFormToData({
      emotion: null,
      comment: '',
    });

    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._setInnerHandlers();
  }

  static parseFormToData(form) {
    return Object.assign({}, form, {
      isEmotion: !!form.emotion,
    });
  }

  static parseDataToForm(data) {
    data = Object.assign({}, data);
    delete data.isEmotion;
    return data;
  }

  /**
   * @return {string}
   */
  getTemplate() {
    return createNewCommentTemplate(NewComment.parseFormToData(this._data));
  }

  setFormSubmitHandler(callback) {
    this._callback[CallbackTypes.SUBMIT] = callback;
    document.querySelector('.film-details__inner')
      .addEventListener(CallbackTypes.SUBMIT, this._submitFormHandler);
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();
    if (!evt.target.closest('.film-details__emoji-item')) {
      return;
    }
    this.updateData({
      emotion: evt.target.value.trim(),
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value.trim(),
    },true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setFormSubmitHandler(this._callback[CallbackTypes.SUBMIT]);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('change', this._emotionChangeHandler);
    this.getElement()
      .querySelector('.film-details__comment-input')
      .addEventListener('input', this._commentInputHandler);
    this._setSubmitShortKeys();
  }

  _setSubmitShortKeys() {
    const pressed = new Set();
    const textarea = this.getElement().querySelector('.film-details__comment-input');

    textarea.addEventListener('keydown', (evt) => {
      pressed.add(evt.key);
      if (pressed.has(Keys.ENTER) && (pressed.has(Keys.META) || pressed.has(Keys.CTRL))) {
        this._submitFormHandler();
      }
    });

    textarea.addEventListener('keyup', (evt) => {
      pressed.delete(evt.key);
    });
  }

  _submitFormHandler() {
    this._callback[CallbackTypes.SUBMIT](NewComment.parseFormToData(this._data));
  }
}
