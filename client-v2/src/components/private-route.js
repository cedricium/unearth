import React from 'react'
import { connect } from 'react-redux'
import { navigate } from 'gatsby'

const PrivateRoute = ({
  component: Component,
  isLoggedIn,
  location,
  ...rest
}) => {
  if (!isLoggedIn && location.pathname !== `/app/login`) {
    navigate('/app/login')
    return null
  }
  return <Component {...rest} />
}

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
})

export default connect(mapStateToProps)(PrivateRoute)
