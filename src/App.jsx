import { useEffect, useRef, useState } from "react";
import "./App.css";

const vitamins = {
  d: {
    name: "Vitamin D",
    icon: "☀️",
    color: "#2563eb",
    light: "#cfe5ff",
    score: "9.3/10",
    scoreNum: 9.3,
    deficiency: "45%",
    level: "High",
    intake: "600–800 IU/day",
    overview:
      "High-impact vitamin with strong evidence for immune regulation and respiratory health support.",
    benefits: [
      "Supports immune system regulation",
      "May reduce risk of respiratory infections",
      "Supports overall bone and muscle health",
    ],
    regions: ["South Asia", "Africa", "Middle East"],
    takeaway:
      "Vitamin D plays a critical role in immune defense and respiratory health, with the highest global deficiency rates among all vitamins.",
  },
  zinc: {
    name: "Zinc",
    icon: "🛡️",
    color: "#4f9c35",
    light: "#def7d3",
    score: "7.8/10",
    scoreNum: 7.8,
    deficiency: "29%",
    level: "Moderate",
    intake: "8–11 mg/day",
    overview:
      "Essential mineral that supports immune function, wound healing, and protein synthesis.",
    benefits: [
      "Supports immune defense",
      "Promotes cellular repair and growth",
      "Helps reduce inflammation",
    ],
    regions: ["South Asia", "Sub-Saharan Africa", "Middle East"],
    takeaway:
      "Zinc is vital for immune defense and cellular repair, with a moderate global deficiency concern.",
  },
  c: {
    name: "Vitamin C",
    icon: "🍊",
    color: "#f59e0b",
    light: "#ffe9b5",
    score: "6.6/10",
    scoreNum: 6.6,
    deficiency: "23%",
    level: "Moderate",
    intake: "75–90 mg/day",
    overview:
      "Powerful antioxidant that supports immune defense and helps protect cells from damage.",
    benefits: [
      "Supports immune system function",
      "Powerful antioxidant protection",
      "Helps maintain healthy skin and tissues",
    ],
    regions: ["South Asia", "Latin America", "Africa"],
    takeaway:
      "Vitamin C is widely recognized for antioxidant properties and immune support, with moderate global deficiency.",
  },
  b6: {
    name: "Vitamin B6",
    icon: "🧠",
    color: "#a855f7",
    light: "#e9d5ff",
    score: "4.8/10",
    scoreNum: 4.8,
    deficiency: "21%",
    level: "Moderate",
    intake: "1.3–1.7 mg/day",
    overview:
      "Supports brain function, immune health, and helps the body metabolize proteins.",
    benefits: [
      "Supports immune cell production",
      "Promotes brain and nervous system health",
      "Aids in metabolism and energy production",
    ],
    regions: ["South Asia", "Africa", "Latin America"],
    takeaway:
      "Vitamin B6 supports multiple critical body functions, with lower deficiency rates but still important in vulnerable regions.",
  },
  e: {
    name: "Vitamin E",
    icon: "💗",
    color: "#ec4899",
    light: "#ffd6e7",
    score: "4.8/10",
    scoreNum: 4.8,
    deficiency: "17%",
    level: "Low",
    intake: "15 mg/day",
    overview:
      "Fat-soluble antioxidant that helps protect cells and supports immune function.",
    benefits: [
      "Powerful antioxidant protection",
      "Supports heart health",
      "Supports immune response",
    ],
    regions: ["Africa", "Middle East", "Southeast Asia"],
    takeaway:
      "Vitamin E provides antioxidant and immune support with lower global deficiency compared to other key vitamins.",
  },
};

const benefitIcons = {
  d: ["shield", "lungs", "bone"],
  zinc: ["shield", "immunedefense", "reduceinflammation"],
  c: ["shield", "antioxidant", "skin&tissues"],
  b6: ["cellproduction", "brain", "energy"],
  e: ["shield", "antioxidant", "heart"],
};

function App() {
  const [page, setPage] = useState("home");
  const [selectedVitamin, setSelectedVitamin] = useState("d");
  const [message, setMessage] = useState("");
  const chatWindowRef = useRef(null);
  const inputRef = useRef(null);
  const [chat, setChat] = useState([
    {
      sender: "ai",
      text: "Hi, I’m ImmuneIQ AI.\n\nHow can I help you today?",
    },
  ]);
  


  const suggestedQuestions = [
    "What is the recommended dosage for Vitamin D?",
    "Is 1000 IU of Vitamin D too much?",
    "What are the benefits of Zinc for immunity?",
    "Which vitamin is best for fighting colds?",
    "Compare Vitamin C and Zinc",
  ];

  const followUps = [
    "Is 1000 IU too much?",
    "What are the benefits?",
    "Can I take it with other vitamins?",
  ];

  function resetChat() {
    setChat([
      {
        sender: "ai",
        text: "Hi, I’m ImmuneIQ AI.\n\nHow can I help you today?",
      },
    ]);
    setMessage("");
  }

  function formatText(text) {
    return text.split(/(\*\*.*?\*\*)/g).map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  }

  async function sendMessage(customMessage) {
  const input = document.getElementById("chatInput");
  const finalMessage = (customMessage || input?.value || "").trim();

  if (!finalMessage) return;

  if (!customMessage && input) {
    input.value = "";
  }

  const updatedChat = [...chat, { sender: "user", text: finalMessage }];
  setChat(updatedChat);

  try {
    const response = await fetch("http://localhost:3001/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: finalMessage, history: updatedChat }),
    });

    const data = await response.json();

    setChat([
      ...updatedChat,
      {
        sender: "ai",
        text: data.reply || "Sorry, I could not answer that right now.",
      },
    ]);
  } catch {
    setChat([
      ...updatedChat,
      {
        sender: "ai",
        text: "Sorry, I could not answer that right now.",
      },
    ]);
  }
}
useEffect(() => {
  const box = chatWindowRef.current;
  if (!box) return;

  setTimeout(() => {
    const rows = box.querySelectorAll(".chatRow");
    const lastRow = rows[rows.length - 1];

    if (lastRow) {
      box.scrollTop = lastRow.offsetTop - box.offsetTop - 20;
    }
  }, 50);
}, [chat]);

  function Nav() {
    return (
      <nav className="nav">
        <div className="logo" onClick={() => setPage("home")}>ImmuneIQ</div>

        <div className="navLinks">
          <span
            className={page === "dashboard" ? "active" : ""}
            onClick={() => setPage("dashboard")}
          >
            ❖ Dashboard
          </span>

          <span
            className={page === "chat" ? "active navChat" : "navChat"}
            onClick={() => setPage("chat")}
          >
            <img src="/chatbubble.png" alt="chat" className="topChatIcon" />
            Immune Chat
          </span>

          <span
            className={page === "about" ? "active" : ""}
            onClick={() => setPage("about")}
          >
            ⓘ About
          </span>
        </div>
      </nav>
    );
  }

  function Footer() {
    return (
      <footer>
        <div className="footerLeft">
          <h2 className="footerLogo">ImmuneIQ</h2>
          <p className="footerTagline">Evidence. Insights. Immunity.</p>
        </div>

        <div className="footerColumn">
          <h3>Quick Links</h3>
          <p onClick={() => setPage("dashboard")}>Dashboard</p>
          <p onClick={() => setPage("chat")}>Immune Chat</p>
          <p>Vitamins</p>
          <p>Research</p>
        </div>

        <div className="footerColumn">
          <h3>Resources</h3>
          <p onClick={() => setPage("about")}>About Us</p>
          <p>Methodology</p>
          <p>Data Sources</p>
          <p>FAQ</p>
        </div>

        <div className="footerColumn">
          <h3>Connect</h3>
          <p>Contact Us</p>
          <p>Feedback</p>
          <p>Privacy Policy</p>
        </div>
      </footer>
    );
  }

  function HomePage() {
    return (
      <main>
        <section className="homeHero">
          <div className="badge">✦ Evidence-Based Analysis</div>
          <h1>
            Boost your immune system
            <br />
            <span>with proven science.</span>
          </h1>
          <p>
            ImmuneIQ aggregates clinical research to score the effectiveness of
            popular vitamins and supplements for immune health.
          </p>

          <div className="heroButtons">
            <button onClick={() => setPage("chat")}>Chat with AI Researcher</button>
            <button onClick={() => setPage("dashboard")}>View Scorecard</button>
          </div>
        </section>

        <section className="homeMiddle">
          <div className="scorecard">
            <div className="scoreTop">
              <h2>Effectiveness Scorecard</h2>
              <span>Evidence Strength Ranking</span>
            </div>

            <div className="barChart">
              {Object.values(vitamins).map((v) => (
                <div className="barItem" key={v.name}>
                  <div
                    className="bar"
                    style={{
                      height: `${v.scoreNum * 22}px`,
                      background: v.color,
                    }}
                  ></div>
                  <p>{v.name}</p>
                </div>
              ))}
            </div>

            <small>Scores based on clinical research, evidence strength and study quality.</small>
          </div>

          <div className="evidenceBox">
            <h2>Why Evidence Matters?</h2>
            <p>
              Not all supplements are created equal. ImmuneIQ uses
              research-backed data to separate health claims from evidence.
            </p>

            <div className="evidenceStats">
              <div>
                <h3>30+</h3>
                <p>Research Entries</p>
              </div>
              <div>
                <h3>5</h3>
                <p>Vitamins Tracked</p>
              </div>
            </div>
          </div>
        </section>

        <section className="insights">
          <h2>Key Research Insights</h2>
          <p>Summary of evidence strength and immune-related findings</p>

          <div className="insightGrid">
            {Object.entries(vitamins).map(([key, v]) => (
              <div
                className="insightCard"
                key={key}
                onClick={() => {
                  setSelectedVitamin(key);
                  setPage("detail");
                }}
              >
                <div>
                  <h3>{v.name}</h3>
                  <p>{v.overview}</p>
                  <small>{key === "d" ? "Clinical trials + meta-analyses" : "Research-backed immune support"}</small>
                </div>
                <span>{v.score}</span>
                <b>›</b>
              </div>
            ))}
          </div>
        </section>
      </main>
    );
  }

  function DashboardPage() {
    return (
      <main>
        <section className="dashHero">
          <h1>ImmuneIQ Health Dashboard</h1>
          <p>
            Explore evidence-based insights and global deficiency trends to make
            informed health decisions.
          </p>

          <div className="dashStats">
            <div>
<span><img src="/star.png" alt="star" /></span>              <p>Highest Evidence</p>
              <h2>Vitamin D</h2>
              <b>9.3 / 10</b>
              <small>Evidence Score</small>
            </div>

            <div>
<span><img src="/world.png" alt="world" /></span>              <p>Most Deficient</p>
              <h2>Vitamin D</h2>
              <b>45%</b>
              <small>Population Deficiency</small>
            </div>

            <div>
<span><img src="/book.png" alt="book" /></span>              <p>Research Sources</p>
              <h2>30+</h2>
              <b>Studies & Datasets</b>
              <small>Across all vitamins</small>
            </div>
          </div>
        </section>

        <section className="comparison">
          <h2>Vitamin Comparison Overview</h2>
          <p>
            Explore evidence strength, deficiency levels and key benefits across
            essential vitamins
          </p>

          <div className="comparisonTable">
            <div className="tableHeader">
              <span>Vitamin</span>
              <span>Evidence Score /10</span>
              <span>Population Deficiency</span>
              <span>Key Benefits</span>
              <span>Details</span>
            </div>

            {Object.entries(vitamins).map(([key, v]) => (
              <div className="tableRow" key={key}>
                <strong>{v.name}</strong>
                <div className="scoreLine">
                  <span>{v.scoreNum}</span>
                  <div>
                    <b
                      style={{
                        width: `${v.scoreNum * 10}%`,
                        background: v.color,
                      }}
                    ></b>
                  </div>
                </div>
                <span className={`pill ${v.level.toLowerCase()}`}>{v.level}</span>
<span className="benefitIcons">
  {benefitIcons[key].map((icon) => (
    <img key={icon} src={`/${icon}.png`} alt={icon} />
  ))}
</span>
                <button
  className={`detailsBtn ${key}`}
  onClick={() => {
    setSelectedVitamin(key);
    setPage("detail");
  }}
>
                  View Details
                </button>
                
              </div>
            ))}
          </div>
        </section>

 <section className="storyboard">
  <div>
    <h2>Explore the Full Interactive Storyboard</h2>
    <p>
      Dive deeper into global deficiency trends, evidence comparisons
      and research-backed vitamin insights through the complete Tableau
      experience.
    </p>

    <div className="miniVisuals">
      <img src="/benefitheatmaps.png" alt="Benefits Heatmap" />
      <img src="/globalmap.png" alt="Global Map" />
      <img src="/populationinsight.png" alt="Population Insight" />
      <img src="/evidenceanalysis.png" alt="Evidence Analysis" />
    </div>
  </div>

  <div className="storyChecks">
    <p>✔ Interactive Maps</p>
    <p>✔ Evidence Explorer</p>
    <p>✔ Vitamin Comparisons</p>
    <p>✔ Research Insights</p>
    <a
  href="https://public.tableau.com/shared/273D7FB4G?:display_count=n&:origin=viz_share_link"
  target="_blank"
  rel="noopener noreferrer"
>
  <button>Launch Interactive Dashboard ↗</button>
</a>
  </div>
  </section>
        </main>
    );
  }

  function ChatPage() {
    return (
      <main>
        <section className="hero">
          <h1>ImmuneIQ AI Chat</h1>
          <p>Ask questions about vitamins, dosages, benefits and immune health.</p>
        </section>

        <section className="topGrid">
          <div className="startCard">
            <h2>Start a Conversation</h2>
            <p>Get evidence-based answers powered by ImmuneIQ AI.</p>

            <div className="questionList">
              {suggestedQuestions.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}>
                  {q}
                  <span>›</span>
                </button>
              ))}
            </div>
          </div>

          <div className="rightSide">
            <img src="/robot.jpg" alt="ImmuneIQ Robot" className="robot" />

            <div className="disclaimerCard">
              <span>Disclaimer</span>
              <p>
                ImmuneIQ AI provides general health information for educational
                purposes only and is not a substitute for professional medical
                advice. Always consult a healthcare professional before taking
                supplements.
              </p>
            </div>
          </div>
        </section>

        <section className="chatSection">
<div className="chatWindow" ref={chatWindowRef}>
                  {chat.map((msg, index) => (
              <div key={index} className={`chatRow ${msg.sender}`}>
                {msg.sender === "ai" && (
                  <img src="/robot-head.png" alt="ImmuneIQ AI" className="avatar botAvatar" />
                )}

                <div className="bubble">{formatText(msg.text)}</div>

                {msg.sender === "user" && <div className="avatar userAvatar">👤</div>}
              </div>
            ))}
          </div>

          <div className="followUps">
            {followUps.map((q) => (
              <button key={q} onClick={() => sendMessage(q)}>
                {q}
              </button>
            ))}
          </div>

          <div className="chatActions">
            <button className="resetBtn" onClick={resetChat}>
              New Chat
            </button>
          </div>

<div className="inputRow">
  <input
  ref={inputRef}
  id="chatInput"
  placeholder="Type your question..."
  autoComplete="off"
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
      setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
    }
  }}
/>

 <button
  type="button"
  onClick={() => {
    sendMessage();
    setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 50);
  }}
>
  ➤
</button>
</div>

        </section>

        <section className="howItWorks">
          <h2>How Immune AI Works</h2>

          <div className="steps">
            <div className="stepCard">
              <img src="/chat.png" alt="" className="stepIcon" />
              <div>
                <h3>Ask a Question</h3>
                <p>Type your question in natural language.</p>
              </div>
            </div>

            <div className="stepCard">
              <img src="/sparkles.png" alt="" className="stepIcon" />
              <div>
                <h3>AI Analyzes</h3>
                <p>Our AI reviews research and evidence.</p>
              </div>
            </div>

            <div className="stepCard">
              <img src="/mind.png" alt="" className="stepIcon" />
              <div>
                <h3>Get Insights</h3>
                <p>Receive clear, evidence-based answers.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="topics">
          <h2>Popular Topics</h2>

          <div className="topicButtons">
            {["Dosage & Safety", "Benefits", "Deficiency", "Comparison", "Research"].map(
              (topic) => (
                <button key={topic} onClick={() => sendMessage(`Tell me about ${topic}`)}>
                  {topic}
                </button>
              )
            )}
          </div>
        </section>
      </main>
    );
  }

  function AboutPage() {
  return (
    <main>
      <section className="aboutHero">
        <div>
          <h1>About ImmuneIQ</h1>
          <p>
            ImmuneIQ is a data-driven platform that brings together clinical
            research, evidence analysis and interactive visualizations to help
            you make informed decisions about vitamins and immune health.
          </p>
        </div>

        <img
          src="/MainAboutImage.png"
          alt="Doctor Illustration"
          className="doctorImage"
        />
      </section>

      <section className="missionCard">
        <img src="/Mission.png" alt="Mission" />
        <div>
          <h2>Our Mission</h2>
          <p>
            To simplify complex health research through powerful data
            visualization and AI, making evidence-based vitamin insights
            accessible to everyone.
          </p>
        </div>
      </section>

      <section className="whatWeDo">
        <h2>What We Do</h2>

        <div className="whatGrid">
          <div>
            <img src="/evidence.png" alt="Evidence Based" />
            <h3>Evidence-based</h3>
            <p>We analyze peer-reviewed studies and clinical research to ensure accuracy.</p>
          </div>

          <div>
            <img src="/datadriven.png" alt="Data Driven" />
            <h3>Data-Driven</h3>
            <p>Our dashboards visualize global trends, deficiency rates and benefits.</p>
          </div>

          <div>
            <img src="/aipowered.png" alt="AI Powered" />
            <h3>AI-Powered</h3>
            <p>Get instant, reliable answers to your vitamin and immune health questions.</p>
          </div>

          <div>
            <img src="/userfriendly.png" alt="User Friendly" />
            <h3>User-Friendly</h3>
            <p>Designed for everyone to explore and understand health data easily.</p>
          </div>
        </div>
      </section>

      <section className="dataSources">
        <h2>Data Sources</h2>
        <p>We aggregate data from trusted research and health organizations.</p>

        <div>
          <img src="/PubMed.png" alt="PubMed" />
          <img src="/NIH.png" alt="NIH" />
          <img src="/WHO.png" alt="World Health Organization" />
          <img src="/cclinic.png" alt="Cleveland Clinic" />
          <img src="/ncbi.png" alt="NCBI" />
        </div>
      </section>

      <section className="aboutDisclaimer">
        <img src="/disclaimer.png" alt="Disclaimer" />
        <div>
          <h2>Disclaimer</h2>
          <p>
            ImmuneIQ provides general health information for educational
            purposes only and is not intended as medical advice, diagnosis or
            treatment. Always consult a qualified healthcare professional.
          </p>
        </div>
      </section>
    </main>
  );
}

  function DetailPage() {
    const v = vitamins[selectedVitamin];

    return (
      <main>
        <section className="detailHero">
          <div className="detailTitle">
            <span style={{ background: v.light }}>{v.icon}</span>
            <h1>{v.name}</h1>
          </div>

          <button onClick={() => setPage("dashboard")}>← Back to Dashboard</button>
        </section>

        <section className="detailTop">
          <div className="detailCard">
            <h3>Evidence Score</h3>
            <h2 style={{ color: v.color }}>{v.score}</h2>
            <div className="progress">
              <span style={{ width: `${v.scoreNum * 10}%`, background: v.color }}></span>
            </div>

            <h3>Population Deficiency Level</h3>
            <h2 style={{ color: v.color }}>{v.deficiency}</h2>
            <b className={`pill ${v.level.toLowerCase()}`}>{v.level}</b>
          </div>

          <div className="detailCard overview">
            <div>
              <h3>Overview</h3>
              <p>{v.overview}</p>
            </div>

            <div className="intake" style={{ background: v.light }}>
              <h3>Recommended Intake</h3>
              <p style={{ color: v.color }}>{v.intake}</p>
            </div>
          </div>
        </section>

        <section className="detailMain">
          <div>
            <h3>Key Benefits</h3>
{v.benefits.map((b, index) => (
  <p className="benefitItem" key={b}>
    <span style={{ background: v.light }}>
      <img src={`/${benefitIcons[selectedVitamin][index]}.png`} alt="" />
    </span>
    {b}
  </p>
))}
          </div>

          <div>
            <h3>Global Deficiency Map</h3>
            <img
  className="vitaminMap"
  src={
    selectedVitamin === "d"
      ? "/VDMap.png"
      : selectedVitamin === "zinc"
      ? "/ZincMap.png"
      : selectedVitamin === "c"
      ? "/VCMap.png"
      : selectedVitamin === "b6"
      ? "/VB6Map.png"
      : "/VEMap.png"
  }
  alt="Vitamin deficiency map"
/>
          </div>

          <div>
            <h3>Top Evidence Types</h3>
            <div className="donut" style={{ borderColor: v.color }}></div>
            <p className="legend">Review Studies • Clinical Trials • Meta-Analysis</p>
          </div>

          <div className="regions">
            <h3>Top Deficient Regions:</h3>
            {v.regions.map((r) => <p key={r}>{r}</p>)}
          </div>

          <div className="takeaway" style={{ background: v.light }}>
            <span style={{ color: v.color }}>★</span>
            <div>
              <h3>Key Takeaway</h3>
              <p>{v.takeaway}</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <div className="page">
      <Nav />

      {page === "home" && <HomePage />}
      {page === "dashboard" && <DashboardPage />}
      {page === "chat" && <ChatPage />}
      {page === "about" && <AboutPage />}
      {page === "detail" && <DetailPage />}

      <Footer />
    </div>
  );
}


export default App;

