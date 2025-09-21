import React, { useState, useEffect } from 'react';
import coralApi from '../services/coralApi';

const CoralDashboard = () => {
  const [coralStatus, setCoralStatus] = useState(null);
  const [networkHealth, setNetworkHealth] = useState(null);
  const [registeredAgents, setRegisteredAgents] = useState([]);
  const [sdkStatus, setSDKStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCoralData();
  }, []);

  const loadCoralData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all Coral Protocol data
      const [status, health, agents, sdk] = await Promise.all([
        coralApi.getCoralStatus(),
        coralApi.getNetworkHealth(),
        coralApi.discoverAgents(),
        coralApi.getSDKStatus()
      ]);

      setCoralStatus(status);
      setNetworkHealth(health);
      setRegisteredAgents(agents.discovered_agents || []);
      setSDKStatus(sdk);
    } catch (err) {
      setError(err.message);
      console.error('Failed to load Coral data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterAgents = async () => {
    try {
      const result = await coralApi.registerAgents();
      console.log('Registration result:', result);
      await loadCoralData(); // Reload data
    } catch (err) {
      setError(`Registration failed: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'operational':
        return 'text-green-600';
      case 'degraded':
        return 'text-yellow-600';
      case 'unhealthy':
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">Coral Protocol v01 Dashboard</h2>
        <p className="text-blue-100">
          Monitor and manage Neural Capital agents in the Coral Protocol network
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* SDK Status */}
      {sdkStatus && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Coral v01 SDK Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">SDK Integration:</span>
              <div className={`font-medium ${sdkStatus.coral_v01_enabled ? 'text-green-600' : 'text-red-600'}`}>
                {sdkStatus.coral_v01_enabled ? '✅ Enabled' : '❌ Disabled'}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Server Available:</span>
              <div className={`font-medium ${sdkStatus.server_available ? 'text-green-600' : 'text-red-600'}`}>
                {sdkStatus.server_available ? '✅ Online' : '❌ Offline'}
              </div>
            </div>
          </div>
          {sdkStatus.endpoints && (
            <div className="mt-4">
              <span className="text-sm text-gray-600">Endpoints:</span>
              <div className="mt-2 space-y-1">
                {Object.entries(sdkStatus.endpoints).map(([key, url]) => (
                  <div key={key} className="text-xs text-blue-600 font-mono">
                    {key}: {url}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Network Health */}
      {networkHealth && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Network Health</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getStatusColor(networkHealth.network_health?.status)}`}>
                {Math.round((networkHealth.network_health?.overall_score || 0) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Health Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {networkHealth.registered_agents?.total || 0}
              </div>
              <div className="text-sm text-gray-600">Registered Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {networkHealth.registered_agents?.healthy || 0}
              </div>
              <div className="text-sm text-gray-600">Healthy Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {networkHealth.discovered_agents?.total || 0}
              </div>
              <div className="text-sm text-gray-600">Discovered Agents</div>
            </div>
          </div>
        </div>
      )}

      {/* Registry Status */}
      {coralStatus && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Registry Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-600">Status:</span>
              <div className={`font-medium ${getStatusColor(coralStatus.registry_status)}`}>
                {coralStatus.registry_status || 'Unknown'}
              </div>
            </div>
            <div>
              <span className="text-sm text-gray-600">Server URL:</span>
              <div className="text-sm font-mono text-blue-600">
                {coralStatus.coral_server_url}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              onClick={handleRegisterAgents}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Register All Agents
            </button>
          </div>
        </div>
      )}

      {/* Registered Agents */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Registered Agents ({registeredAgents.length})
        </h3>
        {registeredAgents.length === 0 ? (
          <p className="text-gray-500">No agents registered. Click "Register All Agents" to get started.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registeredAgents.map((agent, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blue-600">{agent.agent_id}</h4>
                  <span className={`px-2 py-1 text-xs rounded ${agent.is_local ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {agent.is_local ? 'Local' : 'External'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Type: {agent.agent_type}
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Capabilities: {agent.capabilities?.length || 0}
                </div>
                {agent.capabilities && (
                  <div className="flex flex-wrap gap-1">
                    {agent.capabilities.slice(0, 3).map((capability, capIndex) => (
                      <span key={capIndex} className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                        {capability}
                      </span>
                    ))}
                    {agent.capabilities.length > 3 && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        +{agent.capabilities.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadCoralData}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Refresh Data
          </button>
          <button
            onClick={() => window.open(`${coralStatus?.coral_server_url}/studio`, '_blank')}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
            disabled={!coralStatus?.coral_server_url}
          >
            Open Coral Studio
          </button>
          <button
            onClick={() => window.open(`${coralStatus?.coral_server_url}/docs`, '_blank')}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
            disabled={!coralStatus?.coral_server_url}
          >
            API Documentation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoralDashboard;