import { FileClock } from 'lucide-react'
import { Badge, Card, PageHeader } from '../components/UI'
import { aiLogs } from '../data/demo'

export function AiLogsPage() {
  return <div><PageHeader eyebrow="Theo dõi AI" title="Nhật ký AI" description="Hiển thị provider/model trạng thái validation, fallback và latency. Không hiển thị secret hoặc raw PII." />
    <Card className="overflow-hidden"><div className="flex items-center gap-2 border-b border-slate-200 p-4 font-black text-slate-900"><FileClock size={18} /> AI logs</div><div className="table-shell"><table><thead><tr><th>Request type</th><th>Provider</th><th>Validation</th><th>Fallback</th><th>Latency</th><th>Thời gian</th></tr></thead><tbody>{aiLogs.map((row) => <tr key={row.id}><td className="font-black text-slate-900">{row.type}</td><td><Badge tone="blue">{row.provider}</Badge></td><td><Badge tone={row.status === 'VALID' ? 'green' : row.status === 'FALLBACK' ? 'amber' : 'red'}>{row.status}</Badge></td><td>{row.fallback}</td><td className="font-bold">{row.latency}</td><td>{row.time}</td></tr>)}</tbody></table></div></Card>
  </div>
}
