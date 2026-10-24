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
  ]
};

const CONTACTS_LIST = [
  { name: 'Mike', role: 'Product & Systems Design', status: 'Online', avatar: AVATAR_WOMAN },
  { name: 'Trisha', role: 'HCI Research Lead', status: 'Listening to Chilltrax', avatar: AVATAR_TRISHA },
  { name: 'Lucian Marin', role: 'Creator of Moss', status: 'Designing V2', avatar: AVATAR_MAN }
];

export default function WhatsAppApp() {
  const {
    windows,
    setWindowTab,
    minimizeWindow,
    closeWindow
  } = useOS();

  const win = windows.whatsapp;
  const activeTab = win?.activeTab || 'Mike';

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [draft, setDraft] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [conversations, activeTab]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const chatKey = activeTab === 'Trisha' ? 'Trisha' : 'Mike';

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
      const replyAvatar = chatKey === 'Trisha' ? AVATAR_TRISHA : AVATAR_WOMAN;
      const replyAuthor = chatKey === 'Trisha' ? 'trisha' : 'mike';
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
          <div className="moss-whatsapp-rail-tabs" data-no-drag="true">
            {['Mike', 'Trisha', 'Contacts'].map((tab) => (
              <button
                key={tab}
                className={`moss-whatsapp-rail-btn ${activeTab === tab ? 'is-active' : ''}`}
                onClick={() => setWindowTab('whatsapp', tab)}
                title={tab}
              >
                <span className="moss-whatsapp-rotated-label">{tab}</span>
              </button>
            ))}
          </div>

          <div className="moss-twitter-rail-bottom" data-no-drag="true">
            <button
              onClick={() => minimizeWindow('whatsapp', 'switcher')}
              title="Minimize WhatsApp"
            >
              —
            </button>
            <button onClick={() => closeWindow('whatsapp')} title="Close WhatsApp">
              ×
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
                  onClick={() => setDraft((d) => `${d} [moss-v2-spec.png] `.trimStart())}
                  title="Attach File"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
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
                  onClick={() => setWindowTab('whatsapp', c.name === 'Trisha' ? 'Trisha' : 'Mike')}
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
