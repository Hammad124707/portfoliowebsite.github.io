/* Edit this file to add your own projects, images, videos, and articles.
   Put images in:  assets/images/
   Put videos in:  assets/videos/
*/

window.PORTFOLIO = {
  profile: {
    name: "Hammad",
    subtitle: "Computer Engineer",
    heroTitle: "Hi, I’m Ham.",
    heroLead:
      "I build hardware + software projects and write about what I learn.",
    meta: ["Embedded", "Web", "Robotics", "Computer Vision"],
    quickLinks: [
      { label: "GitHub", href: "https://github.com/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
      { label: "Email", href: "mailto:you@example.com" },
    ],
  },

  pastProjects: [
    {
      title: "Smart Sensor Node (ESP32)",
      summary:
        "Battery-powered sensor node with BLE/Wi‑Fi telemetry, data logging, and a simple dashboard.",
      tags: ["ESP32", "C/C++", "BLE", "IoT"],
      media: {
        images: [
          { src: "./assets/images/fourbitadder.jpg.jpg", alt: "Sensor node on desk" },
        ],
        videos: [],
      },
      links: [
        { label: "Repo", href: "https://github.com/" },
        { label: "Write-up", href: "#learning" },
      ],
    },
    {
      title: "FPGA UART + VGA Demo",
      summary:
        "UART RX/TX with a minimal VGA text renderer; learned timing constraints and testing with simulation.",
      tags: ["FPGA", "Verilog", "UART", "VGA"],
      media: {
        images: [
          
        ],
        videos: [
           { src: "./assets/videos/mthmotor.mp4.mp4", title: "FPGA board demo" },

           
        ],
      },
      links: [{ label: "Slides", href: "#" }],
    },
  ],

  currentProjects: [
    {
      title: "Portfolio Website (this one)",
      summary:
        "A free, simple site where people scroll and view embedded images, videos, and articles.",
      tags: ["HTML", "CSS", "JavaScript"],
      media: {
        images: [],
        videos: [],
      },
      links: [{ label: "How to edit", href: "./README.md" }],
    },
    {
      title: "Computer Vision Notes",
      summary:
        "Short experiments on feature matching, calibration, and tracking.",
      tags: ["OpenCV", "Python", "Math"],
      media: {
        images: [],
        videos: [],
      },
      links: [],
    },
  ],

  articles: [
    {
      title: "How I structure my embedded projects",
      date: "2026-03-25",
      tags: ["embedded", "workflow"],
      cover: {
        src: "./assets/images/placeholder-article.svg",
        alt: "Article cover",
      },
      body: [
        "I keep projects **simple and testable**:",
        "",
        "- A `docs/` folder for diagrams + notes",
        "- A `firmware/` folder for source",
        "- A small test harness for sensors and comms",
        "",
        "When something breaks, I can isolate it fast.",
      ],
    },
    {
      title: "UART basics (notes)",
      date: "2026-03-20",
      tags: ["fpga", "digital-design"],
      cover: {
        src: "./assets/images/placeholder-article.svg",
        alt: "UART notes cover",
      },
      body: [
        "UART framing is `start bit` + data bits + optional parity + `stop bit`.",
        "",
        "Two things that helped me:",
        "- Over-sampling in the receiver",
        "- Simulating edge cases (clock drift, jitter)",
      ],
    },
  ],

  about: {
    bio: [
      "I’m a computer engineer interested in building reliable systems across hardware and software.",
      "I like projects that combine embedded + signal processing + practical UI.",
    ],
    skills: [
      "C/C++",
      "Python",
      "JavaScript",
      "Embedded Linux",
      "ESP32 / Arduino",
      "FPGA basics",
      "OpenCV",
    ],
    contact: [
      { label: "Email", href: "mailto:you@example.com" },
      { label: "GitHub", href: "https://github.com/" },
      { label: "LinkedIn", href: "https://www.linkedin.com/" },
    ],
  },
};
