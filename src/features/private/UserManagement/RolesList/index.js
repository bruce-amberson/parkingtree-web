import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { 
  SmartTable,
  TableContainer,
  TableHeader,
  TablePagination,
  TableRows,
  TableToolbar,
} from 'utils/utility/components/SmartTable';

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
  };

  componentWillUnmount() {
    // get list
  }

  render() {
    const { loading } = this.state;
    const { roleList } = this.props;
    return (
      <SmartTable
        idKey='roleId'
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
            onSelect: row => null,
          },
          {
            displayName: 'Delete Role',
            type: 'menu',
            onSelect: row => null,
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
    );
  }

  goToRoute = tabRoute => {
    this.props.history.push(tabRoute);
  }

}

export default connect(select, null)(RolesList);