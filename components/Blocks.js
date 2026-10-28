import Link from "next/link";
import { Icon, InstagramWordmark } from "./icons";
import Reveal from "./Reveal";

const TITLE_SIZES = { sm: "t-sm", md: "t-md", lg: "t-lg", xl: "t-xl" };

function colorOf(color) {
  if (!color) return "var(--theme)";
  if (color === "bright") return "#f0f0f0";
  return color;
}

function MaybeLink({ url, className, children, style }) {
  if (!url) return <div className={className} style={style}>{children}</div>;
  if (!/^https?:/.test(url)) {
    return (
      <Link href={url} className={className} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <a href={url} className={className} style={style} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}

function TitleBlock({ b }) {
  if (b.html !== undefined) {
    return (
      <h2 className="rich">
        <div className={b.headerFill === "transparent" ? "rich-box" : "rich-box filled"}>
          <div className="rich-inner" dangerouslySetInnerHTML={{ __html: b.html }} />
        </div>
      </h2>
    );
  }
  return (
    <h2
      className={`title ${TITLE_SIZES[b.size] || "t-md"}`}
      style={{ color: colorOf(b.color), textAlign: b.align || "center", fontWeight: b.bold ? 700 : 400 }}
    >
      {b.text}
    </h2>
  );
}

function DividerBlock({ b }) {
  return (
    <div
      className="divider"
      style={{ borderBottom: `${b.borderWidth} ${b.variant} ${b.color || "var(--theme)"}` }}
    />
  );
}

function ImageBlock({ b }) {
  const ratio = b.type === "banner" ? "2 / 1" : "1 / 1";
  const cols = b.type === "double" ? 2 : 1;
  return (
    <section>
      <div className="img-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {b.items.map((it, i) => (
          <div key={i} className="img-cell">
            <div className="block-item img-card">
              <MaybeLink url={it.url} className="img-link">
                <div className="img-clip">
                  <div className="img-ratio" style={{ aspectRatio: ratio }}>
                    <img src={it.image} alt={it.text || ""} loading="lazy" />
                  </div>
                </div>
                {it.text && (
                  <div className="img-caption">
                    <span>{it.text}</span>
                  </div>
                )}
              </MaybeLink>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function listFontClass(size, text) {
  if (size === "lg") return text.length > 10 ? "l-lg-long" : "l-lg";
  return "l-sm";
}

function ListBlock({ b }) {
  return (
    <section>
      <div className="list">
        {b.items.map((it, i) => {
          const cls = `list-btn ${listFontClass(b.size, it.text)} ${b.size === "lg" ? "pad-lg" : ""} ${
            it.animation === "pulse" ? "pulse-soft" : ""
          }`;
          const inner = (
            <>
              {it.icon && (
                <div className="list-icon">
                  <Icon name={it.icon} size={b.size === "lg" && it.text.length <= 10 ? 40 : 32} />
                </div>
              )}
              <span className="list-text">
                {it.text}
                {b.withDescription && it.description && <span className="list-desc">{it.description}</span>}
              </span>
            </>
          );
          return (
            <div key={i}>
              {it.url ? (
                <a href={it.url} className={cls} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <button type="button" className={cls}>
                  {inner}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function IntegrationBlock({ b, integrations }) {
  const data = integrations[b.platform];
  if (!data) return null;
  const isIg = b.platform === "instagram";
  return (
    <div className="block-item social-card">
      <a href={b.url} target="_blank" rel="noopener noreferrer" className="social-card-link">
        <div className="social-card-top">
          <div className="social-card-logo">{isIg ? <InstagramWordmark /> : <Icon name="threads" size={36} />}</div>
          <span className={isIg ? "follow-btn ig" : "follow-btn"}>Follow</span>
        </div>
        <div className="social-card-body">
          <div className="social-card-left">
            <p className="social-card-label">{isIg ? "Instagram" : "Threads"}</p>
            <div className="social-card-name">{data.title}</div>
            <div className="social-card-avatar">
              <img src={data.avatar} alt={data.title} loading="lazy" />
            </div>
          </div>
          <div className="social-card-right">
            {isIg ? (
              <div className="ig-grid">
                {data.posts.map((p, i) =>
                  p.image ? (
                    <div key={i} className="ig-tile">
                      <img src={p.image} alt="" loading="lazy" />
                    </div>
                  ) : (
                    <div key={i} className="ig-tile skeleton" />
                  )
                )}
              </div>
            ) : (
              <div>
                <span className="chip">threads.net</span>
                <div className="social-card-desc">{data.description}</div>
              </div>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}

function CollectionBlock({ b }) {
  return (
    <section>
      {b.items.map((it, i) => (
        <div key={i} className="collection-card">
          {it.image && (
            <div className="collection-img">
              <img src={it.image} alt={it.text || ""} loading="lazy" />
            </div>
          )}
          <a href={it.url} className="collection-link" target="_blank" rel="noopener noreferrer">
            <span>{it.text}</span>
            <span className="collection-chev">
              <Icon name="chevronRight" size={16} />
            </span>
          </a>
          {it.description !== undefined && (
            <div className="collection-desc" dangerouslySetInnerHTML={{ __html: it.description }} />
          )}
        </div>
      ))}
    </section>
  );
}

const RENDERERS = {
  title: TitleBlock,
  divider: DividerBlock,
  banner: ImageBlock,
  square: ImageBlock,
  double: ImageBlock,
  list: ListBlock,
  integrations: IntegrationBlock,
  collection: CollectionBlock,
};

export default function Blocks({ blocks, integrations }) {
  return (
    <div className="blocks">
      {blocks.map((b) => {
        const R = RENDERERS[b.type];
        if (!R) return null;
        return (
          <Reveal key={b.id} className="block">
            <R b={b} integrations={integrations} />
          </Reveal>
        );
      })}
    </div>
  );
}
