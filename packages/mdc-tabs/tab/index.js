/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCComponent from '@material/base/component';
import {MDCSimpleMenu} from '@material/menu';
import {MDCRipple} from '@material/ripple';

import {cssClasses} from './constants';
import MDCTabFoundation from './foundation';

export {MDCTabFoundation};

export class MDCTab extends MDCComponent {
  static attachTo(root) {
    return new MDCTab(root);
  }

  get computedWidth() {
    return this.foundation_.getComputedWidth();
  }

  get computedLeft() {
    return this.foundation_.getComputedLeft();
  }

  get isActive() {
    return this.foundation_.isActive();
  }

  set isActive(isActive) {
    this.foundation_.setActive(isActive);
  }

  get options() {
    return this.menu_ ? this.menu_.items : [];
  }

  get preventDefaultOnClick() {
    return this.foundation_.preventsDefaultOnClick();
  }

  set preventDefaultOnClick(preventDefaultOnClick) {
    this.foundation_.setPreventDefaultOnClick(preventDefaultOnClick);
  }

  initialize(menuFactory = (el) => new MDCSimpleMenu(el)) {
    this.menuEl_ = this.root_.querySelector('.mdc-tab__menu');
    this.tabText_ = this.root_.querySelector('.mdc-tab__text');
    if (this.menuEl_) {
      this.menu_ = menuFactory(this.menuEl_);
    } else {
      this.ripple_ = MDCRipple.attachTo(this.root_);
    }
  }

  destroy() {
    if (this.ripple_) {
      this.ripple_.destroy();
    }
    if (this.menu_) {
      this.menu_.destroy();
    }
    super.destroy();
  }

  getDefaultFoundation() {
    return new MDCTabFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => this.root_.removeEventListener(type, handler),
      getOffsetWidth: () => this.root_.offsetWidth,
      getOffsetLeft: () => this.root_.offsetLeft,
      notifySelected: () => this.emit(MDCTabFoundation.strings.SELECTED_EVENT, {tab: this}, true),
      setTextContent: (selectedTextContent) => {
        if (this.tabText_ && this.menu_) {
          this.tabText_.textContent = selectedTextContent;
        }
      },
      getTextContent: () => this.tabText_ ? this.tabText_.textContent : '',
      getNumberOfOptions: () => this.options.length,
      getTextForOptionAtIndex: (index) => this.options[index].textContent,
      getValueForOptionAtIndex: (index) => this.options[index].id || this.options[index].textContent,
      hasMenu: () => this.menu_ !== undefined,
      openMenu: (focusIndex) => this.menu_.show({focusIndex}),
      isMenuOpen: () => this.menu_.open,
      registerMenuInteractionHandler: (type, handler) => this.menu_.listen(type, handler),
      deregisterMenuInteractionHandler: (type, handler) => this.menu_.unlisten(type, handler),
    });
  }

  initialSyncWithDOM() {
    this.isActive = this.root_.classList.contains(cssClasses.ACTIVE);
  }

  measureSelf() {
    this.foundation_.measureSelf();
  }
}
