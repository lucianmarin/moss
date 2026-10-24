import React, { useState, useRef, useEffect } from 'react';
import WindowFrame from '../components/WindowFrame';
import { useOS } from '../context/OSContext';
import { WhatsAppIcon, CircleCloseIcon } from '../components/MossIcons';

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
      avatar: AVATAR_WOMAN,
      text: 'Various versions have evolved over the years, sometimes by accident, sometimes on purpose.'
    },
    {
      id: 'm2',
      side: 'right',
      avatar: AVATAR_MAN,
      text: 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration.'
    },
    {
      id: 'm3',
      side: 'left',
      avatar: AVATAR_WOMAN,
      text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its.'
    }
  ],
  Trisha: [
    {
      id: 't1',
      side: 'left',
      avatar: AVATAR_TRISHA,
      text: 'Have you tried minimizing windows into the top-left V2 switcher stack? The 3D fold feels super natural.'
    },
    {
      id: 't2',
      side: 'right',
      avatar: AVATAR_MAN,
      text: 'Yes! And clicking the Media Player streams Chilltrax live radio right on the desktop.'
    }
  ]
};

const CONTACTS_LIST = [
  { name: 'Mike', role: 'Product & Systems Design', status: 'Online', avatar: AVATAR_WOMAN },
  { name: 'Trisha', role: 'HCI Research Lead', status: 'Listening to Chilltrax', avatar: AVATAR_TRISHA },
  { name: 'Lucian Marin', role: 'Creator of Moss OS', status: 'Designing V2', avatar: AVATAR_MAN }
];

export default function WhatsAppApp() {
  const {
    windows,
    shellMode,
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
      const replies = [
        'Love how clean the alternating message blocks look without bubble clutter.',
        'The V2 teal header keeps all chat tabs right at the top edge.',
        'That interaction is super smooth — pure Moss OS minimalism!'
      ];
      const replyText = replies[Math.floor(Math.random() * replies.length)];
      setConversations((prev) => ({
        ...prev,
        [chatKey]: [
          ...(prev[chatKey] || []),
          {
            id: `r-${Date.now()}`,
            side: 'left',
            avatar: replyAvatar,
            text: replyText
          }
        ]
      }));
    }, 650);
  };

  return (
    <WindowFrame appId="whatsapp" minWidth={290} minHeight={310}>
      <div className="moss-whatsapp-window">
        {/* Teal Brand Header (moss-v2-switcher.png & moss-v2-dock.jpg) */}
        <div
          className="moss-v2-header moss-whatsapp-header"
          onDoubleClick={() => minimizeWindow('whatsapp', 'switcher')}
        >
          <div className="moss-v2-header-left">
            <span className="moss-v2-app-logo">
              <WhatsAppIcon size={21} strokeWidth={2} />
            </span>
            <div className="moss-v2-tabs" data-no-drag="true">
              {['Mike', 'Trisha', 'Contacts'].map((tab) => (
                <button
                  key={tab}
                  className={`moss-v2-tab ${activeTab === tab ? 'is-active' : ''}`}
                  onClick={() => setWindowTab('whatsapp', tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="moss-v2-header-actions" data-no-drag="true">
            <button
              className="moss-win-action-btn moss-minimize-btn"
              onClick={() => minimizeWindow('whatsapp', 'switcher')}
              title="Minimize WhatsApp to Top Stack"
            >
              <span className="moss-min-line" />
            </button>
            <button
              className="moss-win-action-btn"
              onClick={() => closeWindow('whatsapp')}
              title="Close WhatsApp"
            >
              <CircleCloseIcon
                size={20}
                variant={shellMode === 'basic' ? 'square' : 'circle'}
              />
            </button>
          </div>
        </div>

        {/* Sub-header 'Today' bar */}
        <div className="moss-whatsapp-subheader">
          {activeTab === 'Contacts' ? '3 Contacts Online' : 'Today'}
        </div>

        {/* Message List or Contacts List */}
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
    </WindowFrame>
  );
}
