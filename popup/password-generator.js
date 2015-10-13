
function randomInt(min = 0, max = 1) {
  return Math.floor(Math.random() * (max - min)) + min;
}


export default class PasswordGenerator {
  constructor() {
    this._length = 0;
  }

  length(len) {
    this._length = len;

    return this;
  }

  useCharFromEveryGroup() {
    this._useCharFromEveryGroup = true;
    return this;
  }

  excludeLookLike() {
    this._excludeLookLike = true;
    return this;
  }

  useLowerCaseLetters() {
    this._useLowerCaseLetters = true;

    return this;
  }

  useUpperCaseLetters() {
    this._useUpperCaseLetters = true;

    return this;
  }

  useDigits() {
    this._useDigits = true;

    return this;
  }

  useSpecialCharacters() {
    this._useSpecialCharacters = true;

    return this;
  }

  generate() {
    let groups = this._passwordGroups();

    let passwordChars = Array.prototype.concat.apply([], groups);

    let password = [];

    if (this._useCharFromEveryGroup) {
      for (let i = 0; i < groups.length; i++) {
        let pos = randomInt(0, groups[i].length);

        password.push(groups[i][pos]);
      }

      for (let i = groups.length; i < this._length; i++) {
        let pos = randomInt(0, passwordChars.length);

        password.push(passwordChars[pos]);
      }

      // shuffle chars
      for (let i = password.length - 1; i >= 1; i--) {
        let j = randomInt(0, i + 1);

        let tmp = password[i];
        password[i] = password[j];
        password[j] = tmp;
      }

    } else {
      for (let i = 0; i < this._length; i++) {
        let pos = randomInt(0, passwordChars.length);

        password.push(passwordChars[pos]);
      }
    }

    return String.fromCharCode.apply(String, password);
  }

  _passwordGroups() {
    let groups = [];

    if (this._useLowerCaseLetters) {
      let group = [];
      for (let i = 97; i < 97 + 26; i++) {
        if (this._excludeLookLike && i == 108) {
          // "l"
          continue;
        }
        group.push(i);
      }
      groups.push(group);
    }

    if (this._useUpperCaseLetters) {
      let group = [];

      for (let i = 65; i < 65 + 26; i++) {
        if (this._excludeLookLike && (i == 73 || i == 79)) {
          // "I" and "O"
          continue;
        }
        group.push(i);
      }
      groups.push(group);
    }

    if (this._useDigits) {
      let group = [];

      for (let i = 48; i < 48 + 10; i++) {
        if (this._excludeLookLike && (i == 48 || i == 49)) {
          // "0" and "1"
          continue;
        }
        group.push(i);
      }
      groups.push(group);
    }

    if (this._useSpecialCharacters) {
      let group = [];

      for (let i = 33; i <= 47; i++) {
        group.push(i);
      }

      for (let i = 58; i <= 64; i++) {
        group.push(i);
      }

      for (let i = 91; i <= 96; i++) {
        group.push(i);
      }

      for (let i = 123; i <= 126; i++) {
        if (this._excludeLookLike && i == 124) {
          // "|"
          continue;
        }

        group.push(i);
      }

      groups.push(group);
    }

    return groups;
  }
}
