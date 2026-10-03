import {
  INSTANCE_STATE_TEXT,
  getUnknownInstanceStateText,
} from "../constants";

export const InstanceStateBanner = ({ state }: { state: string | null }) => {
  if (!state || state === "authorized") return null;

  return (
    <div className="banner" role="status">
      <span className="banner__text">
        {INSTANCE_STATE_TEXT[state] ?? getUnknownInstanceStateText(state)}
      </span>
      <a
        className="banner__link"
        href="https://console.green-api.com/"
        target="_blank"
        rel="noreferrer"
      >
        Открыть кабинет
      </a>
    </div>
  );
};
