import React from 'react';

import iconMap from '../common/keepass-icon-map';
import clipboardCopy from '../common/clipboard-copy';
import {ConfirmDialog} from './confirm-dialog';
import {GroupDialog} from './group-dialog';
import {EntryDialog} from './entry-dialog';

import Icon from '../common/icon';

import {
  Group,
  Entry
} from 'keepass';

export const GroupView = React.createClass({
  propTypes: {
    group: React.PropTypes.object.isRequired,
    parentGroup: React.PropTypes.object
  },

  contextTypes: {
    showDialog: React.PropTypes.func
  },

  getInitialState() {
    return {
      group: this.props.group,
      showMenu: false
    }
  },

  toggleExpand() {
    this.state.group.toggle();
    this.forceUpdate();
  },

  groupTitle(group) {
    let iconName = iconMap(group.icon);
    if(group.expired()) {
      iconName = iconMap(Icon.Clock);
    }
    return (
      <h5 onClick={this.toggleExpand} onMouseOver={this.showGroupMenu} onMouseOut={this.hideGroupMenu}>
        <Icon name={group.expanded ? "angle-down" : "angle-right"} fixed  /> {iconName && <Icon name={iconName} fixed large />} {group.name}
        <span className="inline-menu">
          <span className="inline-menu--item  btn btn-default btn-xs" onClick={this.addGroup} title="Add new group">
            <Icon name="plus"/>
          </span>
          <span className="inline-menu--item  btn btn-default btn-xs" onClick={this.editGroup} title="Edit group">
            <Icon name="pencil"/>
          </span>
          {this.props.parentGroup &&
            <span className="inline-menu--item  btn btn-default btn-xs" onClick={this.removeGroup} title="Remove group">
              <Icon name="trash-o"/>
            </span>
          }
        </span>
      </h5>
    )
  },

  copyEntryString(entry, field, evt) {
    evt.preventDefault();
    evt.stopPropagation();

    clipboardCopy(entry.get(field));
  },

  entryTitle(entry) {
    let iconName = iconMap(entry.icon);
    if(entry.expired()) {
      iconName = iconMap(Icon.Clock);
    }
    let title = entry.url ?
      <a href={entry.url} onClick={() => chrome.tabs.create({ url: entry.url })}>{entry.title}</a> :
      entry.title;

    return (
      <span className="group-entry" key={entry.uuid}> {iconName && <Icon name={iconName} fixed large />} {title}
        <span className="inline-menu">
          { entry.attribute('UserName') &&
              <span className="inline-menu--item btn btn-default btn-xs" onClick={this.copyEntryString.bind(this, entry, 'UserName')} title="Copy UserName">
                <Icon name="user"/>
              </span>
          }
          { entry.attribute('Password') &&
              <span className="inline-menu--item btn btn-default btn-xs" onClick={this.copyEntryString.bind(this, entry, 'Password')} title="Copy Password">
                <Icon name="key"/>
              </span>
          }
          <span className="inline-menu--item btn btn-default btn-xs" onClick={this.editEntry.bind(this, entry)} title="Edit entry">
            <Icon name="pencil"/>
          </span>
          <span className="inline-menu--item btn btn-default btn-xs" onClick={this.removeEntry.bind(this, entry)} title="Remove entry">
            <Icon name="trash-o"/>
          </span>
        </span>
      </span>
    )
  },

  removeEntry(entry, evt) {
    evt.stopPropagation();

    let that = this;
    this.context.showDialog(ConfirmDialog, {
      onResult: res => {
        if(res) {
          that.state.group.removeEntry(entry)
          that.forceUpdate();
        }
      }
    })
  },

  removeGroup(evt) {
    evt.stopPropagation();

    let that = this;
    this.context.showDialog(ConfirmDialog, {
      onResult: res => {
        if(res) {
          that.props.parentGroup.removeGroup(that.state.group)
          that.forceUpdate();
        }
      }
    })
  },

  editGroup(evt) {
    evt.stopPropagation();

    let that = this;
    this.context.showDialog(GroupDialog, {
      group: that.state.group,
      onOk: () => {
        that.forceUpdate();
      }
    })
  },

  editEntry(entry, evt) {
    evt.stopPropagation();

    let that = this;
    this.context.showDialog(EntryDialog, {
      entry,
      onOk: () => {
        that.forceUpdate();
      }
    })
  },

  addGroup() {
    let that = this;
    this.context.showDialog(GroupDialog, {
      group: new Group(that.state.group._db),
      onOk: (group) => {
        that.state.group.addGroup(group);
        that.forceUpdate();
      }
    })
  },

  addEntry() {
    let that = this;
    this.context.showDialog(EntryDialog, {
      entry: new Entry(that.state.group._db),
      onOk: (entry) => {
        that.state.group.addEntry(entry);
        that.forceUpdate();
      }
    })
  },

  render(){
    const group = this.state.group;
    return (
      <div className="group group-entry">
        {this.groupTitle(group)}
        {group.expanded &&
          <div className="group-content">
            {group.groups.map(g => <GroupView group={g} parentGroup={group} key={g.uuid}/>)}
            {group.entries.map(e => this.entryTitle(e))}
            <a href="#" className="group-entry text-muted" onClick={this.addEntry}>new entry</a>
          </div>
        }
      </div>
    )
  }
})
