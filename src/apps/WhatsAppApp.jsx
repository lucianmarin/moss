import React, { useState, useRef, useEffect } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { WhatsAppIcon } from '../components/MossIcons';

const AVATAR_WOMAN =
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=140&auto=format&fit=crop&q=80';
const AVATAR_MAN =
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=140&auto=format&fit=crop&q=80';
const AVATAR_TRISHA =
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=140&auto=format&fit=crop&q=80';
const AVATAR_ELENA =
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=140&auto=format&fit=crop&q=80';
const AVATAR_ALEX =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=140&auto=format&fit=crop&q=80';

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
  ],
  Elena: [
    {
      id: 'e1',
      side: 'left',
      author: 'elena',
      time: '28m',
      avatar: AVATAR_ELENA,
      text: 'The new spatial dock and top bar presets switch seamlessly.'
    }
  ],
  Alex: [
    {
      id: 'a1',
      side: 'left',
      author: 'alex',
      time: '1h',
      avatar: AVATAR_ALEX,
      text: 'Chilltrax stream metadata polling is locked in and running smoothly.'
    }
  ]
};

const DEFAULT_TABS = ['Mike', 'Trisha'];
const EXTRA_TABS = ['Lucian', 'Elena', 'Alex'];
const ALL_TABS_ORDER = ['Mike', 'Trisha', 'Lucian', 'Elena', 'Alex'];

const CONTACTS_LIST = [
  { name: 'Mike', tab: 'Mike', role: 'Product & Systems Design', status: 'Online', avatar: AVATAR_WOMAN },
  { name: 'Trisha', tab: 'Trisha', role: 'HCI Research Lead', status: 'Listening to Chilltrax', avatar: AVATAR_TRISHA },
  { name: 'Lucian Marin', tab: 'Lucian', role: 'Creator of Moss', status: 'Designing V2', avatar: AVATAR_MAN },
  { name: 'Elena Vance', tab: 'Elena', role: 'Spatial UI Architect', status: 'Online', avatar: AVATAR_ELENA },
  { name: 'Alex Rivera', tab: 'Alex', role: 'Audio Systems Engineer', status: 'Streaming Chilltrax', avatar: AVATAR_ALEX }
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
      const contact = CONTACTS_LIST.find((c) => c.tab === chatKey);
      const replyAvatar = contact?.avatar || AVATAR_WOMAN;
      const replyAuthor = chatKey.toLowerCase();
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

  const openedContacts = tabs.map(
    (tabName) =>
      CONTACTS_LIST.find((c) => c.tab === tabName) || {
        name: tabName,
        tab: tabName,
        role: 'Contact',
        status: 'Online',
        avatar: AVATAR_WOMAN
      }
  );
  const availableContacts = CONTACTS_LIST.filter((c) => !tabs.includes(c.tab));

  return (
    <WindowFrame appId="whatsapp" minWidth={290} minHeight={300}>
      <div className="moss-v1-whatsapp-window">
        {/* Left Vertical Rail like Twitter in moss-v1-twitter.jpg with WhatsApp icon on top and conversation names rotated 90 degrees */}
        <aside
          className="moss-whatsapp-rail"
          onDoubleClick={() => minimizeWindow('whatsapp', 'switcher')}
        >
          <div className="moss-whatsapp-rail-tabs">
            <button
              className={`moss-whatsapp-rail-btn moss-whatsapp-rail-icon-btn ${activeTab === 'Chats' ? 'is-active' : ''}`}
              onClick={() => setWindowTab('whatsapp', 'Chats')}
              title="WhatsApp Chats & Contacts"
            >
              <WhatsAppIcon size={20} />
            </button>
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
            {activeTab === 'Chats' ? `${openedContacts.length} Opened · ${availableContacts.length} Available` : 'Today'}
          </div>

          {activeTab !== 'Chats' ? (
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
              <div className="moss-wa-section-title">Opened Conversations</div>
              {openedContacts.map((c) => {
                const msgs = conversations[c.tab] || [];
                const lastMsg = msgs[msgs.length - 1];
                return (
                  <div
                    key={c.tab}
                    className="moss-wa-contact-card"
                    onClick={() => switchTab(c.tab)}
                  >
                    <img src={c.avatar} alt={c.name} className="moss-wa-avatar" />
                    <div className="moss-wa-contact-info">
                      <div className="moss-wa-contact-top">
                        <strong>{c.name}</strong>
                        {lastMsg && <span className="moss-wa-time">{lastMsg.time}</span>}
                      </div>
                      <div className="moss-wa-last-msg">
                        {lastMsg ? lastMsg.text : c.role}
                      </div>
                    </div>
                  </div>
                );
              })}

              {availableContacts.length > 0 && (
                <>
                  <div className="moss-wa-section-title">Other Contacts</div>
                  {availableContacts.map((c) => (
                    <div
                      key={c.tab}
                      className="moss-wa-contact-card"
                      onClick={() => switchTab(c.tab)}
                    >
                      <img src={c.avatar} alt={c.name} className="moss-wa-avatar" />
                      <div className="moss-wa-contact-info">
                        <div className="moss-wa-contact-top">
                          <strong>{c.name}</strong>
                          <span className="moss-wa-status">{c.status}</span>
                        </div>
                        <div className="moss-wa-last-msg">{c.role}</div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </WindowFrame>
  );
}
