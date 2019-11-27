import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import SyncLoader from 'react-spinners/SyncLoader'
import Navigation from './utils/Navigation'
import {
  closeConnection,
  connectClient,
  checkSyncStatus,
  syncRedditSaves,
} from '../../utils/api'

const Sync = ({ id, username, refreshToken }) => {
  const [isConnected, setIsConnected] = useState(false)
  const [hasSyncedWithReddit, setHasSyncedWithReddit] = useState(false)
  const [syncStatus, setSyncStatus] = useState('not-started')

  // Empty dependency array passed as second argument effectively means this
  // `useEffect` function will only be triggered when this component mounts.
  // Reference: https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    connectClient({ id, username, refreshToken }, (error, response) => {
      if (response && response.status === 'success') {
        setIsConnected(true)
      }
    })
    // Returning a function from inside the `useEffect` function enables the
    // optional cleanup mechanism. Necessary in this case to remove socket.io
    // event listeners and disconnect the socket when the component unmounts.
    return closeConnection
  }, [])

  useEffect(() => {
    checkSyncStatus((error, response) => updateSyncStatus(response))
  }, [isConnected])

  const syncSaves = () => {
    setSyncStatus('in-progress')
    syncRedditSaves((error, response) => {
      updateSyncStatus(response)
    })
  }

  const updateSyncStatus = response => {
    const { has_synced_with_reddit, sync_status } = response
    setHasSyncedWithReddit(has_synced_with_reddit)
    setSyncStatus(sync_status)
  }

  if (!isConnected) return <p>Loading...</p>

  return (
    <div className='step_3'>
      <h3>Step 3</h3>
      <p>
        Let's sync your saved things. When you're ready, click the button below.
      </p>
      <p>
        <small>
          Note: this may take a few moments depending on the number of things
          you have saved. Do not close this tab or refresh the page.
        </small>
      </p>
      {syncStatus === 'in-progress' && (
        <SyncLoader size={8} sizeUnit={'px'} loading={true} />
      )}
      <button
        style={{ display: syncStatus === 'not-started' ? 'block' : 'none' }}
        onClick={() => syncSaves()}
      >
        Sync Reddit Saves
      </button>
      <p>Current Sync Status: {syncStatus && syncStatus}</p>
      <p>
        {syncStatus === 'failed' &&
          'An error occurred while syncing your saves!'}
      </p>
      <Navigation />
    </div>
  )
}

const mapStateToProps = state => ({
  id: state.user.id,
  username: state.user.username,
  refreshToken: state.auth.refreshToken,
})

export default connect(mapStateToProps)(Sync)
