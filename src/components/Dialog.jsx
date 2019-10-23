import React from 'react';
import PropTypes from 'prop-types';

import { deadlineValidation, attachedImageValidation, toBase64Promise } from '../utils/helper.js';

class Dialog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputTitle: this.props.item ? this.props.item.title : "",
      inputDescription: this.props.item ? this.props.item.description : "",
      inputPriority: this.props.item ? this.props.item.priority : "",
      inputDeadline: this.props.item ? this.props.item.deadline : "",
      inputAttachedImage: this.props.item ? this.props.item.attachedImage : "",
    };

    this.attachedImageRef = React.createRef();
  }

  onTitleChange = (event) => { this.setState({ inputTitle: event.target.value, }); }
  onDescriptionChange = (event) => { this.setState({ inputDescription: event.target.value, }); }
  onPriorityChange = (event) => { this.setState({ inputPriority: event.target.value, }); }
  onDeadlineChange = (event) => { this.setState({ inputDeadline: event.target.value, }); }
  onDialogPreventFromClosingClicked = (event) => { event.stopPropagation(); }

  setAttachedImageState = (files) => {
    if (attachedImageValidation(files)) {
      let promise = toBase64Promise(files[0]).then((file) => {
        this.setState({ inputAttachedImage: file });
      });
    }
  }

  onAttachedImageChange = () => { this.setAttachedImageState(this.attachedImageRef.current.files); }
  onAttachedImageDragEnter = (event) => { event.stopPropagation(); event.preventDefault(); }
  onAttachedImageDragOver = (event) => { event.stopPropagation(); event.preventDefault(); }
  onAttachedImageDrop = (event) => {
    this.setAttachedImageState(event.dataTransfer.files);
    event.stopPropagation();
    event.preventDefault();
  }

  generateResultingItem = () => {
    return {
      id: this.props.item ? this.props.item.id : -1,
      title: this.state.inputTitle,
      description: this.state.inputDescription,
      priority: this.state.inputPriority,
      deadline: deadlineValidation(this.state.inputDeadline),
      attachedImage: this.state.inputAttachedImage,
      isDone: this.props.item ? this.props.item.isDone : false,
    };
  }

  onSubmit = (event) => {
    event.preventDefault();
    this.props.parent(this.generateResultingItem());
  }

  render() {
    const { item, close, parent } = this.props;
    const { inputTitle, inputDescription, inputPriority, inputDeadline, inputAttachedImage } = this.state;

    return (
      <section className="modal-window" onClick={close}>
        <div className="modal-window-item" onClick={this.onDialogPreventFromClosingClicked}>
          <section className="header">
            <div className="modal-title">{item ? `Edit item ${item.id}` : `Add new item`}</div>
            <div className="modal-close-icon" onClick={close}>
              <div className="modal-close-icon-inner"></div>
            </div>
          </section>

          <section className="content">
            <form onSubmit={this.onSubmit}>
              <section className="form-elements-block">
                <input onChange={this.onTitleChange} required type="text" name="title"
                       placeholder="Title *" value={inputTitle}
                       pattern="(?=.*[a-z])(?=.*[A-Z]).{2,20}" className="input" />
                <input onChange={this.onDescriptionChange} type="text" name="description"
                       placeholder="Description" value={inputDescription} className="input" />

                <select onChange={this.onPriorityChange} required name="priority"
                        value={inputPriority} className="select" >
                  <option className="option" value="">Priority *</option>
                  <option className="option" value="low" className="low">low</option>
                  <option className="option" value="middle" className="middle">middle</option>
                  <option className="option" value="high" className="high">high</option>
                </select>

                <input onChange={this.onDeadlineChange} type="date" name="deadline"
                       placeholder=" " value={inputDeadline} className="input" />

                <div className="attach-image-block" name="image-drop"
                     onDragEnter={this.onAttachedImageDragEnter}
                     onDragOver={this.onAttachedImageDragOver} onDrop={this.onAttachedImageDrop}>
                  <input type="file" name="image-input" className="attach-image"
                         ref={this.attachedImageRef} accept="image/*"
                         onChange={this.onAttachedImageChange} />
                  <p className="text">Attach image (200kb max)</p>
                </div>
                {inputAttachedImage ? <img src={inputAttachedImage} className="thumbnail" alt="thumbnail" />
                                    : <p className="thumbnail-text">no file or invalid file</p>}
              </section>

              <section className="buttons">
                <div className="buttons-item">
                  <input className="input negative" type="button"
                         value="Cancel" onClick={close} />
                  <input className="input positive" type="submit"
                         value={item ? `Edit item` : `Add item`} />
                </div>
              </section>
            </form>
          </section>
        </div>
      </section>
    );
  }
}

Dialog.propTypes = {
  close: PropTypes.func,
  parent: PropTypes.func,
  item: PropTypes.object,
};

Dialog.defaultProps = {

};

export default Dialog;
