const state = {
  input: '',
  content: ''
};

const onChangeHandler = (event) => {
  state[event.target.name] = event.target.value;
};

const configureForm = () => {
  const form = document.createElement('form');
  form.setAttribute('id', 'form');
  let titleInput = document.createElement('input');
  let contentInput = document.createElement('input');
  titleInput.setAttribute('name', 'title');
  contentInput.setAttribute('name', 'content');
  titleInput.addEventListener('change', onChangeHandler);
  contentInput.addEventListener('change', onChangeHandler);
  let titleLabel = document.createElement('label');
  let contentLabel = document.createElement('label');
  titleLabel.innerText = 'Title: ';
  contentLabel.innerText = 'Content: ';
  const submitButton = document.createElement('button');
  submitButton.innerText = 'submit';
  return {
    form,
    submitButton,
    titleInput,
    contentInput,
    titleLabel,
    contentLabel
  };
};

const attachForm = () => {
  const {
    form,
    submitButton,
    titleInput,
    contentInput,
    titleLabel,
    contentLabel
  } = configureForm();
  let titleDiv, contentDiv;
  titleDiv = contentDiv = document.createElement('div');
  titleDiv.appendChild(titleInput);
  contentDiv.appendChild(contentInput);
  titleInput.parentElement.insertAdjacentElement('afterbegin', titleLabel);
  contentInput.parentElement.insertAdjacentElement('afterbegin', contentLabel);
  form.appendChild(titleInput);
  form.appendChild(contentInput);
  form.appendChild(submitButton);
  document.body.appendChild(form);
  return form;
};
const composeElements = () => {
  const form = attachForm();

  form.addEventListener('submit', (event) => {
    // disable default action
    event.preventDefault();

    // configure a request
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'api/blogs');

    // prepare form data
    let data = {
      title: 'My Title',
      content: 'My Content'
    };
    // let data = {
    //   title: state.title,
    //   content: state.content
    // };

    // set headers
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('credentials', 'same-site');

    // xhr.withCredentials = true;
    xhr.responseType = 'json';

    // send request
    xhr.send(JSON.stringify(data));

    // listen for `load` event
    xhr.onload = () => {
      console.log(xhr.response);
    };
  });
};
