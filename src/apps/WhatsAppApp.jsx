import React, { useState, useRef, useEffect } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';

const AVATAR_WOMAN =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80';
const AVATAR_MAN =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80';
const AVATAR_TRISHA =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80';

const INITIAL_CONVERSATIONS = {
  Mike: [
    {
      id: 'm1',
      side: 'left',
      author: 'mike',
      time: '15m',
      avatar: AVATAR_WOMAN,
      text: 'Various versions have evolved over the years, sometimes by accident, sometimes on purpose.'
    },
    {
      id: 'm2',
      side: 'right',
      author: 'lucianmarin',
      time: '4m',
      avatar: AVATAR_MAN,
      text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.'
    },
    {
      id: 'm3',
      side: 'left',
      author: 'mike',
      time: '2s',
      avatar: AVATAR_WOMAN,
      text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its.'
    }
  ],
  Trisha: [
    {
      id: 't1',
      side: 'left',
      author: 'trisha',
      time: '12m',
      avatar: AVATAR_TRISHA,
      text: 'Have you tried minimizing windows into the top-left switcher stack? The 3D fold feels super natural.'
    },
    {
      id: 't2',
      side: 'right',
      author: 'lucianmarin',
      time: '1m',
      avatar: AVATAR_MAN,
      text: 'Yes! And clicking the Media Player streams Chilltrax live radio right on the desktop.'
    }
  ],
  Lucian: [
    {
      id: 'l1',
      side: 'left',
      author: 'lucianmarin',
      time: '5m',
      avatar: AVATAR_MAN,
      text: 'Testing the unified gray and black window controls across horizontal and vertical tabbed apps.'
    }
  ]
};

const DEFAULT_TABS = ['Mike', 'Trisha', 'Contacts'];
const EXTRA_TABS = ['Lucian'];
const ALL_TABS_ORDER = ['Mike', 'Trisha', 'Contacts', 'Lucian'];

const CONTACTS_LIST = [
  { name: 'Mike', tab: 'Mike', role: 'Product & Systems Design', status: 'Online', avatar: AVATAR_WOMAN },
  { name: 'Trisha', tab: 'Trisha', role: 'HCI Research Lead', status: 'Listening to Chilltrax', avatar: AVATAR_TRISHA },
  { name: 'Lucian Marin', tab: 'Lucian', role: 'Creator of Moss', status: 'Designing V2', avatar: AVATAR_MAN }
];

export default function WhatsAppApp() {
  const {
    windows,
    setWindowTab,
    minimizeWindow
  } = useOS();

  const win = windows.whatsapp;
  const activeTab = win?.activeTab || 'Mike';

  const [tabs, setTabs] = useState(DEFAULT_TABS);
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  const switchTab = (tabName) => {
    if (!tabs.includes(tabName)) {
      setTabs((prev) => [...prev, tabName]);
    }
    setWindowTab('whatsapp', tabName);
  };

  const handleNewWhatsAppTab = () => {
    const nextToOpen =
      EXTRA_TABS.find((t) => !tabs.includes(t)) ||
      ALL_TABS_ORDER.find((t) => !tabs.includes(t));

    if (nextToOpen) {
      setTabs((prev) => [...prev, nextToOpen]);
      setWindowTab('whatsapp', nextToOpen);
    } else {
      const idx = tabs.indexOf(activeTab);
      const nextFallback = tabs[(idx + 1) % tabs.length] || 'Mike';
      setWindowTab('whatsapp', nextFallback);
    }
  };

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [conversations, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const chatKey = conversations[activeTab] ? activeTab : 'Mike';

    const userMsg = {
      id: `u-${Date.now()}`,
      side: 'right',
      author: 'lucianmarin',
      time: '1s',
      avatar: AVATAR_MAN,
      text
    };

    setConversations((prev) => ({
      ...prev,
      [chatKey]: [...(prev[chatKey] || []), userMsg]
    }));
    setDraft('');

    setTimeout(() => {
      const replyAvatar =
        chatKey === 'Trisha' ? AVATAR_TRISHA : chatKey === 'Lucian' ? AVATAR_MAN : AVATAR_WOMAN;
      const replyAuthor =
        chatKey === 'Trisha' ? 'trisha' : chatKey === 'Lucian' ? 'lucianmarin' : 'mike';
      const replies = [
        'Love how clean the vertical 90-degree rail tabs look in WhatsApp.',
        'The V1 vertical rail keeps all conversation names right along the left edge.',
        'That interaction is super smooth — pure Moss minimalism!'
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      setConversations((prev) => ({
        ...prev,
        [chatKey]: [
          ...(prev[chatKey] || []),
          {
            id: `r-${Date.now()}`,
            side: 'left',
            author: replyAuthor,
            time: '1s',
            avatar: replyAvatar,
            text: replyText
          }
        ]
      }));
    }, 650);
  };

  return (
    <WindowFrame appId="whatsapp" minWidth={290} minHeight={300}>
      <div className="moss-v1-whatsapp-window">
        {/* Left Vertical Rail like Twitter in moss-v1-twitter.jpg with conversation names rotated 90 degrees */}
        <aside
          className="moss-whatsapp-rail"
          onDoubleClick={() => minimizeWindow('whatsapp', 'switcher')}
        >
          <div className="moss-whatsapp-rail-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`moss-whatsapp-rail-btn ${activeTab === tab ? 'is-active' : ''}`}
                onClick={() => switchTab(tab)}
                title={tab}
              >
                <span className="moss-whatsapp-rotated-label">{tab}</span>
              </button>
            ))}
          </div>

          <div className="moss-twitter-rail-bottom" data-no-drag="true">
            <button
              onClick={() => minimizeWindow('whatsapp', 'switcher')}
              title="Minimize WhatsApp (_)"
            >
              _
            </button>
            <button
              onClick={handleNewWhatsAppTab}
              title="New Tab (+)"
            >
              +
            </button>
          </div>
        </aside>

        {/* Right Conversation Column */}
        <div className="moss-whatsapp-main">
          <div className="moss-whatsapp-subheader">
            {activeTab === 'Contacts' ? '3 Contacts Online' : 'Today'}
          </div>

          {activeTab !== 'Contacts' ? (
            <>
              <div className="moss-whatsapp-messages" ref={listRef} data-no-drag="true">
                {(conversations[activeTab] || conversations.Mike).map((msg) => (
                  <div
                    key={msg.id}
                    className={`moss-wa-row ${msg.side === 'right' ? 'is-right' : 'is-left'}`}
                  >
                    {msg.side === 'left' && (
                      <img src={msg.avatar} alt="" className="moss-wa-avatar" />
                    )}
                    <p className="moss-wa-text">{msg.text}</p>
                    {msg.side === 'right' && (
                      <img src={msg.avatar} alt="" className="moss-wa-avatar" />
                    )}
                  </div>
                ))}
              </div>

              <form
                className="moss-whatsapp-composer"
                onSubmit={handleSendMessage}
                data-no-drag="true"
              >
                <button
                  type="button"
                  className="moss-wa-attach-btn"
                  onClick={() => setDraft((d) => `${d} [photo.jpg] `.trimStart())}
                  title="Send Photo"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={`Write ${activeTab}`}
                  className="moss-wa-input"
                />
              </form>
            </>
          ) : (
            <div className="moss-whatsapp-contacts" data-no-drag="true">
              {CONTACTS_LIST.map((c) => (
                <div
                  key={c.name}
                  className="moss-wa-contact-card"
                  onClick={() => switchTab(c.tab || 'Mike')}
                >
                  <img src={c.avatar} alt={c.name} className="moss-wa-avatar" />
                  <div>
                    <strong>{c.name}</strong>
                    <div>{c.role}</div>
                    <span className="moss-wa-status">{c.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}
