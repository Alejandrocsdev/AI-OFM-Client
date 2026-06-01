// Module CSS
import S from './style.module.css';
// Libraries
import { useState, useEffect, useCallback } from 'react';
// API
import { api, axiosPublic } from '../../api';
// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faServer, faDatabase, faPlay, faStop, faArrowsRotate, faTrash } from '@fortawesome/free-solid-svg-icons';
// Components
import Loader from '../../components/Loader';
// Assets
import comfyuiImg from '../../assets/img/comfyui.png';
import jupyterImg from '../../assets/img/jupyter.png';

const isTransitional = (s) => s === null || s === 'loading' || s === 'rebooting';

// ── Sub-components ──────────────────────────────────────────────────────────

const AppLinkButton = ({ href, src, label }) => {
  const inner = (
    <>
      <img src={src} className={S.appIcon} alt={label} />
      <span>{label}</span>
    </>
  );
  return href
    ? <a href={href} target="_blank" rel="noopener noreferrer" className={S.appBtn}>{inner}</a>
    : <div className={`${S.appBtn} ${S.appBtnDisabled}`}>{inner}</div>;
};

const StatusDisplay = ({ status }) => {
  if (isTransitional(status))
    return <Loader color="var(--text-secondary)" width={40} height={10} />;
  const running = status === 'running';
  return (
    <>
      <span className={`${S.statusDot} ${running ? S.dotGreen : S.dotRed}`} />
      <span className={`${S.statusText} ${running ? S.textGreen : S.textMuted}`}>
        {running ? 'Running' : 'Stopped'}
      </span>
    </>
  );
};

// ── InstanceCard ────────────────────────────────────────────────────────────

const InstanceCard = ({ instance, onRefetch }) => {
  const [actioning, setActioning] = useState(false);

  const { id, gpu_name, actual_status, instance: costs, storage_cost,
    public_ipaddr, ports, jupyter_token, volume_info } = instance;

  const volume = volume_info?.[0];
  const running = actual_status === 'running';
  const exited = actual_status === 'exited';
  const buttonsDisabled = actioning || isTransitional(actual_status);

  const hourlyCost = costs?.totalHour != null && storage_cost != null
    ? `$${(costs.totalHour + storage_cost / 30 / 24).toFixed(2)}`
    : '—';

  const comfyuiUrl = running && ports?.['8188/tcp']?.[0]?.HostPort
    ? `https://${public_ipaddr}:${ports['8188/tcp'][0].HostPort}`
    : null;

  const jupyterUrl = running && ports?.['8080/tcp']?.[0]?.HostPort
    ? `https://${public_ipaddr}:${ports['8080/tcp'][0].HostPort}?token=${jupyter_token}`
    : null;

  const doAction = (request) => {
    setActioning(true);
    api(request, {
      onSuccess: () => onRefetch(),
      onFinally: () => setActioning(false),
    });
  };

  const call = (method, suffix = '') => () =>
    doAction(axiosPublic[method](`/api/vast/instances/${id}${suffix}`));

  const primaryBtn = running
    ? { label: 'Stop', icon: faStop, onClick: call('post', '/stop'), className: S.stopBtn }
    : { label: 'Start', icon: faPlay, onClick: call('post', '/start'), className: S.startBtn };

  return (
    <div className={S.instanceCard}>
      <div className={S.cardHeader}>
        <div className={S.iconBox}><FontAwesomeIcon icon={faServer} /></div>
        <span className={S.cardTitle}>Instance</span>
        <div className={S.idBadge}>
          <span className={S.idLabel}>Instance ID</span>
          <span className={S.idValue}>{id}</span>
        </div>
        <span className={S.gpuName}>{gpu_name}</span>
        <div className={S.statusIndicator}>
          <StatusDisplay status={actual_status} />
        </div>
        <span className={S.hourlyCost}>{hourlyCost}</span>
      </div>

      <div className={S.cardBody}>
        <div className={S.appButtons}>
          <AppLinkButton href={comfyuiUrl} src={comfyuiImg} label="ComfyUI" />
          <AppLinkButton href={jupyterUrl} src={jupyterImg} label="Jupyter" />
        </div>
        <div className={S.controlButtons}>
          <button className={`${S.actionBtn} ${primaryBtn.className}`} onClick={primaryBtn.onClick} disabled={buttonsDisabled}>
            <FontAwesomeIcon icon={primaryBtn.icon} /><span>{primaryBtn.label}</span>
          </button>
          <button className={`${S.actionBtn} ${S.restartBtn}`} onClick={call('post', '/reboot')} disabled={buttonsDisabled || exited}>
            <FontAwesomeIcon icon={faArrowsRotate} /><span>Restart</span>
          </button>
          <button className={`${S.actionBtn} ${S.deleteBtn}`} onClick={call('delete')} disabled={actioning}>
            <FontAwesomeIcon icon={faTrash} /><span>Delete</span>
          </button>
        </div>
      </div>

      {volume && (
        <div className={S.cardFooter}>
          <div className={S.volumeIconBox}><FontAwesomeIcon icon={faDatabase} /></div>
          <span className={S.cardTitle}>Volume</span>
          <div className={S.idBadge}>
            <span className={S.idLabel}>Volume ID</span>
            <span className={S.idValue}>{volume.id}</span>
          </div>
          <span className={S.storageInfo}>{volume.avail_space} / {volume.total_space} GB</span>
        </div>
      )}
    </div>
  );
};

// ── Home ────────────────────────────────────────────────────────────────────

const Home = () => {
  const [instances, setInstances] = useState(null);
  const [error, setError] = useState(null);

  const fetchInstances = useCallback(() => {
    api(axiosPublic.get('/api/vast/instances'), {
      onSuccess: (data) => { setInstances(data.instances ?? []); setError(null); },
      onError: () => { setError('Failed to load instances.'); setInstances([]); },
    });
  }, []);

  useEffect(() => { fetchInstances(); }, [fetchInstances]);

  if (instances === null)
    return <div className={S.page}><div className={S.centerState}><Loader color="var(--accent-primary)" /></div></div>;
  if (error)
    return <div className={S.page}><div className={S.centerState}><span className={S.errorText}>{error}</span></div></div>;
  if (!instances.length)
    return <div className={S.page}><div className={S.centerState}><span className={S.emptyText}>No instances found.</span></div></div>;

  return (
    <div className={S.page}>
      {instances.length > 1 && (
        <div className={S.warningBanner}>
          Multiple instances detected. Please delete extra instances to continue.
        </div>
      )}
      {instances.map((inst) => (
        <InstanceCard key={inst.id} instance={inst} onRefetch={fetchInstances} />
      ))}
    </div>
  );
};

export default Home;
