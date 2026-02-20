import { useEffect, useState } from "react";
import api from "../api/api";

function Status() {
	const [status, setStatus] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchStatus = async () => {
			try {
				const res = await api.get('/status');
				setStatus(res.data);
			} catch (err) {
				setStatus({ error: err.response?.data || err.message });
			} finally {
				setLoading(false);
			}
		};
		fetchStatus();
	}, []);

	if (loading) return <div>Checking status...</div>;

	if (!status) return <div>No status available</div>;

	return (
		<div>
			<h2>System Status</h2>
			{status.error ? (
				<div className="message error">{JSON.stringify(status.error)}</div>
			) : (
				<div className="status-grid">
					<div><strong>Backend:</strong> {status.backend}</div>
					<div><strong>Database:</strong> {status.database}</div>
					<div><strong>LLM:</strong> {status.llm}</div>
					<div><strong>Total Chunks:</strong> {status.stats?.totalChunks ?? 'n/a'}</div>
					<div><strong>Total Repositories:</strong> {status.stats?.totalRepositories ?? 'n/a'}</div>
				</div>
			)}
		</div>
	);
}

export default Status;
