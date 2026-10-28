import { Icon } from "./icons";
import HeaderButtons from "./HeaderButtons";

export default function Profile({ profile, social }) {
  const line = social.find((s) => s.platform === "line");
  return (
    <div className="profile">
      <div className="profile-cover">
        <div className="profile-cover-mask">
          <img src={profile.avatar} alt={profile.name} />
        </div>
        <div className="profile-name">
          <h1>{profile.name}</h1>
        </div>
        <HeaderButtons name={profile.name} avatar={profile.avatar} lineUrl={line?.url} />
      </div>
      <p className="profile-desc">{profile.description}</p>
      <ul className="social">
        {social.map((s) => (
          <li key={s.platform}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.platform}>
              <Icon name={s.platform} size={24} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
