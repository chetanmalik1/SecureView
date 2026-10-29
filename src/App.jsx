import { useState } from 'react'

export default function App() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState('all')
  const [protocol, setProtocol] = useState('')
  const [timeRange, setTimeRange] = useState('')
  const [paused, setPaused] = useState(false)

  // Stream state - pending socket ingestion
  const [events, setEvents] = useState([])
  const [alerts, setAlerts] = useState([])

  const hasFilter = search !== '' || action !== 'all' || protocol !== '' || timeRange !== ''

  function clearFilters() {
    setSearch('')
    setAction('all')
    setProtocol('')
    setTimeRange('')
  }

  return (
    <div className="dashboard">

      <header className="topbar">
        <span className="topbar-name">SecureView</span>

        <div className="topbar-right">
          <div className="status">
            <span className="status-lbl">Log source</span>
            <span className="status-val">none configured</span>
          </div>

          <div className="status">
            <span className="status-lbl">Stream</span>
            <span className="status-val">offline</span>
          </div>

          <div className="status">
            <span className="status-lbl">Events</span>
            <span className="status-val">0</span>
          </div>

          <button
            className="topbar-btn"
            disabled
            title="No events to export"
            aria-label="Export events as CSV"
          >
            Export CSV
          </button>
          <button
            className="topbar-btn"
            disabled
            title="No events to export"
            aria-label="Export events as PDF"
          >
            Export PDF
          </button>
        </div>
      </header>

      <div className="filters" role="search" aria-label="Event filters">
        <input
          type="search"
          className={`search-input${search ? ' active' : ''}`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search IP or port"
          aria-label="Search by IP address or port number"
        />

        <div className="action-toggle" role="group" aria-label="Filter by action">
          {['all', 'allow', 'deny'].map((a) => (
            <button
              key={a}
              aria-pressed={action === a}
              onClick={() => setAction(a)}
            >
              {a.charAt(0).toUpperCase() + a.slice(1)}
            </button>
          ))}
        </div>

        <select
          className={`filter-select${protocol ? ' active' : ''}`}
          value={protocol}
          onChange={e => setProtocol(e.target.value)}
          aria-label="Filter by protocol"
        >
          <option value="">All protocols</option>
          <option value="TCP">TCP</option>
          <option value="UDP">UDP</option>
          <option value="ICMP">ICMP</option>
        </select>

        <select
          className={`filter-select${timeRange ? ' active' : ''}`}
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          aria-label="Filter by time range"
        >
          <option value="">All time</option>
          <option value="1h">Last hour</option>
          <option value="6h">Last 6 hours</option>
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
        </select>

        <div className="filter-actions">
          <button
            className="filter-btn"
            aria-pressed={paused}
            onClick={() => setPaused(!paused)}
            title={paused ? 'Resume live feed' : 'Pause live feed'}
            aria-label={paused ? 'Resume feed' : 'Pause feed'}
          >
            {paused ? 'Resume' : 'Pause'}
          </button>

          <button
            className="filter-btn"
            disabled={!hasFilter}
            onClick={clearFilters}
            title={hasFilter ? 'Clear filters' : undefined}
            aria-label="Clear all filters"
          >
            Clear filters
          </button>
        </div>
      </div>

      <div className="content">

        <section className="feed" aria-label="Live event feed">
          <div className="panel-head">
            <span className="panel-lbl">Live feed</span>
          </div>

          <div className="feed-scroll">
            <table className="feed-table">
              <colgroup>
                <col className="col-time" />
                <col className="col-srcip" />
                <col className="col-dstip" />
                <col className="col-port" />
                <col className="col-proto" />
                <col className="col-action" />
                <col className="col-bytes" />
              </colgroup>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Source IP</th>
                  <th>Destination IP</th>
                  <th>Port</th>
                  <th>Proto</th>
                  <th>Action</th>
                  <th>Bytes</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 && (
                  <tr>
                    <td colSpan={7}>
                      <div className="feed-empty">
                        <p className="empty">
                          {hasFilter ? (
                            <>
                              No events match these filters.{' '}
                              <button className="link-btn" onClick={clearFilters}>
                                Clear filters
                              </button>
                            </>
                          ) : (
                            'No events yet. Waiting for log source.'
                          )}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="alerts" aria-label="Alerts and incident timeline">
          <div className="panel-head">
            <span className="panel-lbl">Alerts</span>
          </div>

          <div className="alerts-scroll">
            {alerts.length === 0 && (
              <p className="empty">
                No active alerts. Connect a log source to begin threat detection.
              </p>
            )}
          </div>
        </aside>

        <div className="stats">
          <section className="stat-panel" aria-label="Top attackers">
            <div className="panel-head">
              <span className="panel-lbl">Top attackers</span>
            </div>
            <div className="stat-body">
              <p className="empty">
                No attacker data available. Waiting for log stream.
              </p>
            </div>
          </section>

          <section className="stat-panel" aria-label="Top targeted ports">
            <div className="panel-head">
              <span className="panel-lbl">Top targeted ports</span>
            </div>
            <div className="stat-body">
              <p className="empty">
                No port activity recorded yet.
              </p>
            </div>
          </section>

          <section className="stat-panel" aria-label="Detections">
            <div className="panel-head">
              <span className="panel-lbl">Detections</span>
            </div>
            <div className="stat-body">
              <div className="det-row">
                <span>Brute-force attempts</span>
                <span className="det-val">0</span>
              </div>
              <div className="det-row">
                <span>Port scans</span>
                <span className="det-val">0</span>
              </div>
            </div>
          </section>
        </div>

      </div>

      <footer className="engine" aria-label="Engine status">
        <span className="engine-item">
          <span className="engine-lbl">queue</span>0 / 1024
        </span>
        <span className="engine-sep" aria-hidden="true">·</span>
        <span className="engine-item">
          <span className="engine-lbl">index entries</span>0
        </span>
        <span className="engine-sep" aria-hidden="true">·</span>
        <span className="engine-item">
          <span className="engine-lbl">heap size</span>0
        </span>
        <span className="engine-sep" aria-hidden="true">·</span>
        <span className="engine-item">
          <span className="engine-lbl">window entries</span>0
        </span>
      </footer>

    </div>
  )
}
