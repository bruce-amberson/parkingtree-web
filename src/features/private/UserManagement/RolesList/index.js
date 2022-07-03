import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Button } from '@material-ui/core';

import { 
  SmartTable,
  TableContainer,
  TableHeader,
  TablePagination,
  TableRows,
  TableToolbar,
} from 'utils/utility/components/SmartTable';

import { Modal } from 'utils/utility/components/Modal';

import 'features/private/UserManagement/RolesList/styles.css';

const select = (state) => ({
  roleList: state.usermgmt.roles,
});

export class RolesList extends Component {

  static propTypes = {
    roleList: PropTypes.array.isRequired,
  };

  state = {
    loading: false,
    confirmDelete: false,
    roleDeleteId: -1
  };

  componentWillUnmount() {
    // get list
  }

  render() {
    const { loading } = this.state;
    const { roleList } = this.props;
    return (
      <div>
        <div style={{ textAlign: 'right' }}>
          <Button
            variant='contained'
            onClick={() => null}
          >
            add user role
          </Button>
        </div>
        <SmartTable
          idKey='roleId'
          title='User Roles'
          rows={roleList}
          loading={loading}
          columns={[
            {
              key: 'roleName',
              title: 'Role',
              type: 'string',
            },
          ]}
          actions={[
            {
              displayName: 'Edit Role',
              type: 'menu',
              onSelect: row => this.goToRoute(`/user-management/rolesmanage/${row.roleId}`),
            },
            {
              displayName: 'Delete Role',
              type: 'menu',
              onSelect: row => this.setState({ confirmDelete: true, roleDeleteId: row.roleId }),
              showIf: () => true,
            },
          ]}
        >
          <TableToolbar />
          <TableContainer maxHeight='100%'>
            <TableHeader />
            <TableRows />
          </TableContainer>
          <TablePagination />
        </SmartTable>
        {this.confirmDelete()}
      </div>
    );
  }

  confirmDelete() {
    const actionButtons = [
      {
        label: 'OK',
        action: () => this.deleteRole(),
        buttonType: 'text',
      },
    ];

    return (
      <Modal
        actionButtons={actionButtons}
        fullScreen={false}
        maxWidth={'md'}
        modal={false}
        onCloseModal={() => this.setState({ confirmDelete: false })}
        show={this.state.confirmDelete}
        title='Confirm Delete'
      >
        <div style={{ margin: '0 0%', height: '55px', paddingTop: '15px' }}>
          Are you sure you want to delete this Role?
        </div>
      </Modal>
    );
  }

  deleteRole() {
    const { roleDeleteId } = this.state;
    console.log(roleDeleteId);
    this.setState({ confirmDelete: false });
  }

  goToRoute = tabRoute => {
    this.props.history.push(tabRoute);
  }

}

export default connect(select, null)(RolesList);