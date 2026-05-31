const Loader = ({ color = 'currentColor', width = 80, height = 20 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 120 30"
    fill={color}
    aria-label="loading"
    role="status"
  >
    <circle cx="15" cy="15" r="15">
      <animate attributeName="r" values="15;9;15" dur="0.8s" calcMode="linear" repeatCount="indefinite" />
      <animate attributeName="fill-opacity" values="1;.5;1" dur="0.8s" calcMode="linear" repeatCount="indefinite" />
    </circle>
    <circle cx="60" cy="15" r="9">
      <animate attributeName="r" values="9;15;9" dur="0.8s" calcMode="linear" repeatCount="indefinite" />
      <animate attributeName="fill-opacity" values=".5;1;.5" dur="0.8s" calcMode="linear" repeatCount="indefinite" />
    </circle>
    <circle cx="105" cy="15" r="15">
      <animate attributeName="r" values="15;9;15" dur="0.8s" calcMode="linear" repeatCount="indefinite" />
      <animate attributeName="fill-opacity" values="1;.5;1" dur="0.8s" calcMode="linear" repeatCount="indefinite" />
    </circle>
  </svg>
);

export default Loader;
