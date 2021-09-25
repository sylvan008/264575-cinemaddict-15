import SmartComponent from '../smart-component.js';
import {emotions} from '../utils/const.js';

const DISABLED = 'disabled';
const Keys = {
  META: 'Meta',
  ENTER: 'Enter',
  CTRL: 'Control',
};

const CallbackTypes = {
  SUBMIT: 'submit',
  CHANGE: 'change',
};

const createEmojiItem = (emoji, isDisabled) =>
  `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}" ${isDisabled ? DISABLED : ''}>
    <label class="film-details__emoji-label" for="emoji-${emoji}">
      <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>
`;

const createNewCommentTemplate = ({emotion, comment, isEmotion, isDisabled}) =>
  `<div class="film-details__new-comment">
    <div class="film-details__add-emoji-label">
      ${isEmotion ? `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">` : ''}
    </div>

    <label class="film-details__comment-label">
      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isDisabled ? DISABLED : ''}>${comment}</textarea>
    </label>

    <div class="film-details__emoji-list">
      ${emotions.map((emoji) => createEmojiItem(emoji, isDisabled)).join('')}
    </div>
  </div>
`;

export default class NewComment extends SmartComponent {
  constructor(formElement) {
    super();
    this._formElement = formElement;
    this._data = NewComment.parseFormToData({
      emotion: null,
      comment: '',
    });

    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._submitFormHandler = this._submitFormHandler.bind(this);
    this._setInnerHandlers();
  }

  static parseFormToData(form) {
    return Object.assign({}, form, {
      isEmotion: !!form.emotion,
      isDisabled: !!form.isDisabled,
      isSaving: !!form.isSaving,
    });
  }

  static parseDataToForm(data) {
    data = Object.assign({}, data);
    delete data.isEmotion;
    delete data.isSaving,
    delete data.isDisabled;
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
    this._formElement.addEventListener(CallbackTypes.SUBMIT, this._submitFormHandler);
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
      comment:evt.target.value.trim(),
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
    this.getElement().querySelector('.film-details__comment-input').addEventListener(
      'keydown', (evt) => {
        if (evt.key === Keys.ENTER && (evt.ctrlKey || evt.metaKey)) {
          this._submitFormHandler();
        }
      },
    );
  }

  _validateForm() {
    if (this._data.emotion === null) {
      return false;
    }

    return this._data.comment.trim() !== '';
  }

  _submitFormHandler() {
    if (!this._validateForm()) {
      return;
    }
    if (this._data.isSaving) {
      return;
    }
    this._callback[CallbackTypes.SUBMIT](NewComment.parseDataToForm(this._data));
  }
}
