'use client'

import { useState, useEffect, useCallback } from 'react'
import '@/app/globals.css'

/* ------------------------------------------------------------------ */
/*  Step data                                                          */
/* ------------------------------------------------------------------ */
interface Step {
  title: string
  lhs: React.ReactNode
  rhs: React.ReactNode
}

function steps(): Step[] {
  return [
    // Step 1
    {
      title: 'Current State — Fleet-Wide Toggle',
      lhs: (
        <>
          <div className="state-tag">S1 — Current experience</div>
          <WebFrame
            breadcrumb={<>Admin › Fleet Settings › <span className="bc-link">Driver Identification</span></>}
            activeNav="Admin"
          >
            <SettingsSection title="Driver Identification Methods" subtitle="Configure how drivers are identified and matched to trips.">
              <ToggleRow label="Driver App Pairing" sub="Drivers log in via the Motive Driver App" on />
              <ToggleRow label="Static Pairing" sub="Permanently assign drivers to vehicles" on />
              <div className="focus-ring">
                <ToggleRow label="Face Match" sub="Use AI dashcam to identify drivers by facial recognition" on />
              </div>
              <InfoCallout color="amber" icon="⚠️">
                Face Match is currently <strong>fleet-wide</strong>. When enabled, it applies to all vehicles with an AI Dashcam Plus. There is no way to enable for specific groups.
              </InfoCallout>
              <ToggleRow label="Smart Trip Match" sub="Automatically match unidentified trips using historical data" on />
            </SettingsSection>
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={1} />
          <Hero title={<>Face Match is <em>all-or-nothing</em></>} body="Today, enabling Face Match is a single fleet-wide toggle. There is no way for fleet admins to selectively enable it for specific vehicle groups." />
          <Section color="blue" label="Design Direction">
            <p>The highlighted toggle is the only Face Match control available. Flipping it enables facial recognition across every vehicle with an AI Dashcam Plus — regardless of region, division, or union agreements.</p>
          </Section>
          <Section color="amber" label="Data">
            <div className="r-stats">
              <Stat num="6+" label="Manual enablement tickets filed" />
              <Stat num="3+" label="Repeat rounds for KLX alone" />
            </div>
          </Section>
          <Section color="teal" label="User Voice">
            <Quote text="Only want these vehicles enabled to test the product before releasing to their entire fleet." attr="KLX — ACOM-4167" />
          </Section>
        </>
      ),
    },
    // Step 2
    {
      title: 'The Problem — Manual Script Workflow',
      lhs: (
        <>
          <div className="state-tag">S2 — Current workaround</div>
          <WebFrame
            breadcrumb={<>Slack › <span className="bc-link">#fleet-foundation</span></>}
            activeNav="Admin"
          >
            <div style={{ background: '#f8f5f1', padding: 16 }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--warm-gray-5)', marginBottom: 12, fontWeight: 700 }}>Current Process: How Face Match Gets Enabled for a Subset</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ChatMsg initials="SK" color="blue" name="Simon Kaufmann">
                  Enable Face Match for set of vehicles for Strat fleet. Created a ticket here — <span style={{ color: 'var(--motive-blue)' }}>DI-1713</span>. Can we pick up running the script we've used in the past to only enable face match for a limited set of vehicles?
                </ChatMsg>
                <ChatMsg initials="SM" color="teal" name="Saravana Mahesh">
                  Yes I can take this.
                </ChatMsg>
                <div style={{ borderLeft: '3px solid var(--rose)', padding: '10px 14px', borderRadius: '0 8px 8px 0', background: 'var(--rose-light)', marginTop: 8 }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--rose)', marginBottom: 4 }}>CURRENT WORKFLOW</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--warm-dark-2)', lineHeight: 1.5 }}>
                    1. Customer requests subset enablement → CSM creates Jira ticket<br />
                    2. PM triages and tags on-call DI engineer<br />
                    3. Engineer runs manual script against production DB<br />
                    4. Manual validation that correct vehicles are enabled<br />
                    5. Repeat for every group change or new customer request
                  </div>
                </div>
                <ChatMsg initials="US" color="amber" name="Usman Saeed">
                  +1 for group level face match enablement in near future, possibly H2. This will solve all these issues, fleets can enable the face match for the group and add/remove vehicles to the group.
                </ChatMsg>
              </div>
            </div>
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={2} />
          <Hero title={<>Every enablement requires <em>engineering</em></>} body="No self-service path exists. Every subset enablement request goes through Slack, Jira, and a manual production script." />
          <Section color="teal" label="User Voice">
            <Quote text="I'm working with a strategic enterprise fleet that will be leveraging face match, they have a strong union presence and therefore some of their regions cannot use Face Match. We will need to control very specifically which vehicles will initiate the face match process." attr="Simon Kaufmann — PM, Slack #fleet-foundation, Feb 2026" />
            <Quote text="This will solve all these issues, fleets can enable the face match for the group and add/remove vehicles to the group to enable/disable the face match." attr="Usman Saeed — DI Engineer, Slack, Mar 2026" />
          </Section>
          <Section color="rose" label="Decision">
            <Callout color="rose" header="Problem">
              This manual process has been in place since Face Match launched. It consumes DI on-call time, delays customer onboarding, and creates compliance risk for union fleets that cannot afford accidental fleet-wide enablement.
            </Callout>
          </Section>
        </>
      ),
    },
    // Step 3
    {
      title: 'Group Picker in Driver ID Settings',
      lhs: (
        <>
          <div className="state-tag">S3 — New: Quick path</div>
          <WebFrame
            breadcrumb={<>Admin › Fleet Settings › <span className="bc-link">Driver Identification</span></>}
            activeNav="Admin"
          >
            <SettingsSection title="Driver Identification Methods">
              <ToggleRow label="Driver App Pairing" sub="Drivers log in via the Motive Driver App" on />
              <ToggleRow label="Static Pairing" on />
              <div style={{ border: '2px solid var(--blue)', borderRadius: 10, padding: 2 }}>
                <ToggleRow label="Face Match" sub="Use AI dashcam to identify drivers by facial recognition" on style={{ marginBottom: 0, borderRadius: '8px 8px 0 0' }} />
                <div className="group-picker focus-ring" style={{ borderRadius: '0 0 8px 8px', borderTop: 0, marginTop: 0 }}>
                  <div className="gp-header">
                    <div className="gp-title">Enabled Groups</div>
                    <div className="gp-count">3 of 5 groups</div>
                  </div>
                  <GroupRow name="Northeast Division" count="342 vehicles" enabled checked />
                  <GroupRow name="Southeast Division" count="287 vehicles" enabled checked />
                  <GroupRow name="Heavy Duty Fleet" count="156 vehicles" enabled checked />
                  <GroupRow name="Western Union Region" count="198 vehicles" />
                  <GroupRow name="Canada Operations" count="89 vehicles" />
                  <InfoCallout color="blue" icon="ℹ️" style={{ marginTop: 8 }}>
                    Face Match will only run on vehicles in enabled groups. Vehicles in disabled groups will not capture or process facial images.
                  </InfoCallout>
                </div>
              </div>
              <ToggleRow label="Smart Trip Match" on style={{ marginTop: 8 }} />
            </SettingsSection>
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={3} />
          <Hero title={<>The <em>quick path</em> for fleet admins</>} body="A group picker appears directly below the Face Match toggle — right where admins already go to configure driver identification." />
          <Section color="blue" label="Design Direction">
            <p>When Face Match is enabled, a group picker expands below the toggle showing all vehicle groups. Admins check/uncheck groups to control where Face Match runs.</p>
            <p>This is the <strong>primary surface</strong> most fleet admins will use. No need to navigate to GLS Settings Profiles for this common task.</p>
          </Section>
          <Section color="amber" label="Data">
            <div className="r-stats">
              <Stat num="785" label="Vehicles enabled across 3 groups" />
              <Stat num="287" label="Vehicles excluded (union/compliance)" />
            </div>
          </Section>
          <Section color="rose" label="Decision">
            <Callout color="blue" header="Recommendation">
              The group picker reads and writes the same GLS state. Changes here are immediately reflected in Settings Profiles (Step 4), and vice versa. One source of truth, two entry points.
            </Callout>
          </Section>
        </>
      ),
    },
    // Step 4
    {
      title: 'GLS Settings Profile — Face Match Toggle',
      lhs: (
        <>
          <div className="state-tag">S4 — GLS Profile path</div>
          <WebFrame
            breadcrumb={<>Admin › <span className="bc-link">Group Level Settings</span> › Edit Profile</>}
            activeNav="Admin"
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Northeast Division Safety Settings</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--warm-gray-5)' }}>Applied to: Northeast Division (342 vehicles)</div>
              </div>
              <button style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid var(--motive-blue)', background: 'var(--motive-blue)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, cursor: 'default' }}>Save Profile</button>
            </div>
            <ProfileCard name="Safety Settings" desc="Dashcam and safety alert configuration">
              <ProfileSetting name="Harsh Braking Alert" on />
              <ProfileSetting name="Distracted Driving Alert" on />
            </ProfileCard>
            <ProfileCard name="Driver Identification" desc="Face Match and driver assignment settings" highlight>
              <ProfileSetting name="Face Match" sub="AI-powered facial recognition for driver identification" on highlight />
              <ProfileSetting name="Group Verification" on />
            </ProfileCard>
            <ProfileCard name="AI Coach Settings" desc="In-cab coaching and alerts">
              <ProfileSetting name="Coaching Recaps" on />
            </ProfileCard>
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={4} />
          <Hero title={<>Face Match as a <em>GLS Product Area</em></>} body="For admins who manage settings via Group Level Settings Profiles, Face Match appears alongside Safety and AI Coach — the same UX pattern they already know." />
          <Section color="blue" label="Design Direction">
            <p>Face Match registers as a &quot;Driver Identification&quot; Product Area in GLS Phase 2. The profile includes two toggles:</p>
            <p><strong>Face Match</strong> — controls whether facial recognition runs on vehicles in this group.</p>
            <p><strong>Group Verification</strong> — controls whether matches are validated against group membership (prevents cross-group misidentification).</p>
          </Section>
          <Section color="teal" label="User Voice">
            <Quote text="AI Coach, for instance, requires group-level management that couldn't be supported under the current framework." attr="GLS Phase 2 PRD — same pattern applies to Face Match" />
          </Section>
          <Section color="amber" label="Data">
            <p>GLS Phase 2 is TDD-complete with beta May 30 and GA June 30, 2026. DI team integration effort: 2-3 weeks on top of the platform.</p>
          </Section>
        </>
      ),
    },
    // Step 5
    {
      title: 'Bidirectional Sync — One Source of Truth',
      lhs: (
        <>
          <div className="state-tag">S5 — Sync behavior</div>
          <WebFrame
            breadcrumb={<>Admin › Fleet Settings › <span className="bc-link">Driver Identification</span></>}
            activeNav="Admin"
          >
            <div className="sync-indicator">
              <div className="si-icon">🔄</div>
              <div className="si-text">Settings synced with GLS Profile: &quot;Northeast Division Safety Settings&quot;</div>
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
              <div style={{ flex: 1, border: '2px solid var(--blue)', borderRadius: 10, padding: 12, background: 'var(--blue-light)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>Driver ID Settings</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>Face Match</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                  <Chip enabled>Northeast ✓</Chip>
                  <Chip enabled>Southeast ✓</Chip>
                  <Chip enabled>Heavy Duty ✓</Chip>
                  <Chip>Western ✗</Chip>
                  <Chip>Canada ✗</Chip>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2rem', color: 'var(--motive-blue)' }}>⇄</div>
              <div style={{ flex: 1, border: '2px solid var(--blue)', borderRadius: 10, padding: 12, background: 'var(--blue-light)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--blue)', textTransform: 'uppercase' as const, letterSpacing: '0.06em', marginBottom: 6 }}>GLS Profile</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, marginBottom: 4 }}>Northeast Division Safety</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' as const }}>
                  <Chip enabled>Face Match: ON</Chip>
                  <Chip enabled>Group Verify: ON</Chip>
                </div>
              </div>
            </div>
            <InfoCallout color="blue" icon="🔗">
              Changes made here are automatically reflected in the GLS Settings Profile, and changes made in GLS are reflected here. Both surfaces read and write the same underlying configuration.
            </InfoCallout>
            <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: 'var(--warm-gray-1)' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, marginBottom: 8 }}>What happens when you change a group here:</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--warm-dark-2)', lineHeight: 1.8 }}>
                ✓ Group picker updates instantly<br />
                ✓ GLS Profile reflects the change<br />
                ✓ Vehicles in the group start/stop Face Match processing<br />
                ✓ GLSLog records the change with your identity
              </div>
            </div>
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={5} />
          <Hero title={<>Two doors, <em>one room</em></>} body="The Driver ID group picker and GLS Settings Profiles are two views of the same underlying state. Edit in one, see it in the other." />
          <Section color="rose" label="Decision">
            <Callout color="blue" header="Recommendation">
              The group picker in Driver ID settings writes to the same GLS data model. This avoids configuration drift and ensures fleet admins always see a consistent state regardless of which settings surface they prefer.
            </Callout>
          </Section>
          <Section color="blue" label="Design Direction">
            <p><strong>Quick path:</strong> Admin → Driver Identification → group picker. Best for simple enable/disable per group.</p>
            <p><strong>Profile path:</strong> Admin → GLS → Settings Profile. Best for managing Face Match alongside Safety and AI Coach settings in a unified profile.</p>
            <p>Both surfaces use the GLS API. The sync indicator at the top tells the admin which profile governs the current view.</p>
          </Section>
        </>
      ),
    },
    // Step 6
    {
      title: 'Inheritance — Company → Group → Vehicle',
      lhs: (
        <>
          <div className="state-tag">S6 — Settings hierarchy</div>
          <WebFrame
            breadcrumb={<>Admin › <span className="bc-link">Group Level Settings</span> › Inheritance View</>}
            activeNav="Admin"
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>Face Match — Settings Inheritance</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--warm-gray-5)', marginBottom: 12 }}>Shows how Face Match is resolved for each vehicle based on the settings hierarchy.</div>
            <table className="inh-table">
              <thead><tr><th>Vehicle</th><th>Group</th><th>Face Match</th><th>Source</th></tr></thead>
              <tbody>
                <InhRow vehicle="Truck #1042" group="Northeast Division" enabled source="group" />
                <InhRow vehicle="Truck #1043" group="Northeast Division" enabled source="group" />
                <InhRow vehicle="Van #2201" group="Western Union Region" source="group" />
                <InhRow vehicle="Truck #3305" group="Heavy Duty Fleet" enabled source="group" />
                <InhRow vehicle="Truck #3310" group="Heavy Duty Fleet" source="vehicle" bold />
                <InhRow vehicle="Truck #4401" group="Canada Operations" source="group" />
              </tbody>
            </table>
            <InfoCallout color="blue" icon="📋" style={{ marginTop: 12 }}>
              <strong>Hierarchy:</strong> Company → Group (Profile) → Vehicle. Vehicle-level overrides take precedence over group settings. Truck #3310 has a vehicle-level override disabling Face Match despite the group being enabled.
            </InfoCallout>
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={6} />
          <Hero title={<>Settings <em>cascade</em> correctly</>} body="The GLS hierarchy ensures settings flow from company → group → vehicle, with each level able to override the one above." />
          <Section color="blue" label="Design Direction">
            <p>The inheritance view shows fleet admins exactly how Face Match resolves for each vehicle. The &quot;Source&quot; column makes it clear whether the setting comes from a group profile or a vehicle-level override.</p>
            <p>This fixes the current broken hierarchy where company-level settings override vehicle-level — GLS gets this right by design.</p>
          </Section>
          <Section color="amber" label="Data">
            <p>The GLSLog table records every change with the user who made it, the source level (company/group/vehicle), and the timestamp. This provides a full audit trail — critical for union compliance.</p>
            <div className="r-stats">
              <Stat num="3" label="Hierarchy levels (company → group → vehicle)" />
            </div>
          </Section>
          <Section color="teal" label="User Voice">
            <Quote text="We will need to control very specifically which vehicles will initiate the face match process. Given their strong union we must be solid here." attr="Simon Kaufmann — PM, on union fleet requirements" />
          </Section>
        </>
      ),
    },
    // Step 7
    {
      title: 'New Vehicle — Automatic Inheritance',
      lhs: (
        <>
          <div className="state-tag">S7 — Inheritance in action</div>
          <WebFrame
            breadcrumb={<>Fleet Dashboard › Vehicles › <span className="bc-link">Northeast Division</span></>}
            activeNav="Fleet Dashboard"
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>Northeast Division</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--warm-gray-5)', marginBottom: 12 }}>342 vehicles · Face Match: Enabled via GLS Profile</div>
            <table className="inh-table">
              <thead><tr><th>Vehicle</th><th>AIDC+</th><th>Face Match</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>Truck #1042</td><td style={{ color: '#166534' }}>✓</td><td style={{ color: '#166534', fontWeight: 700 }}>Enabled</td><td><span className="src src-inherited">Active</span></td></tr>
                <tr><td>Truck #1043</td><td style={{ color: '#166534' }}>✓</td><td style={{ color: '#166534', fontWeight: 700 }}>Enabled</td><td><span className="src src-inherited">Active</span></td></tr>
                <tr><td>Truck #1044</td><td style={{ color: '#166534' }}>✓</td><td style={{ color: '#166534', fontWeight: 700 }}>Enabled</td><td><span className="src src-inherited">Active</span></td></tr>
                <tr style={{ background: 'var(--accent-light)' }}><td style={{ fontWeight: 700 }}>Truck #1098 <span className="new-badge">NEW</span></td><td style={{ color: '#166534' }}>✓</td><td style={{ color: '#166534', fontWeight: 700 }}>Enabled</td><td><span className="src src-group">Inherited</span></td></tr>
              </tbody>
            </table>
            <InfoCallout color="green" icon="✅" style={{ marginTop: 12 }}>
              <strong>Truck #1098</strong> was added to Northeast Division today. Face Match was automatically enabled — no ticket, no script, no engineer needed.
            </InfoCallout>
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={7} />
          <Hero title={<>New vehicles <em>just work</em></>} body="When a vehicle is added to a group with Face Match enabled, it inherits the setting automatically. No manual intervention required." />
          <Section color="amber" label="Data">
            <p>This eliminates the &quot;new vehicle&quot; gap that plagues vehicle-level bulk assignment (Option D). With group inheritance, the fleet admin&apos;s intent is captured once at the group level and applied forever.</p>
            <div className="r-stats">
              <Stat num="0" label="Tickets needed for new vehicle setup" />
              <Stat num="0" label="Scripts needed to run" />
            </div>
          </Section>
          <Section color="blue" label="Design Direction">
            <p>This is the key advantage of riding GLS over building a bespoke solution. The Admin Platform team has already built the inheritance engine — DI team gets this behavior for free.</p>
          </Section>
        </>
      ),
    },
    // Step 8
    {
      title: 'Group Verification — Match Validation',
      lhs: (
        <>
          <div className="state-tag">S8 — Match-time verification</div>
          <WebFrame
            breadcrumb={<>Fleet Dashboard › Trips › <span className="bc-link">Recent Activity</span></>}
            activeNav="Fleet Dashboard"
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 12 }}>Driver Identification — Recent Trips</div>
            <TripResult initials="JD" name="John Davis" sub="Northeast Division · Truck #1042 · Today 8:42 AM" status="matched" statusText="✓ Face Match — Identified (confidence: 94.2%)" detail="Driver group matches vehicle group → match accepted" />
            <TripResult initials="MR" name="Maria Rodriguez" sub="Southeast Division · Truck #3305 (Heavy Duty Fleet) · Today 9:15 AM" status="blocked" statusText="✗ Face Match — Group Mismatch" detail="Driver group (Southeast) ≠ vehicle group (Heavy Duty) → match rejected, trip left unidentified" highlight />
            <TripResult initials="??" name="Unidentified" sub="Western Union Region · Van #2201 · Today 10:03 AM" status="unmatched" statusText="— Face Match Disabled for Group" detail="Western Union Region has Face Match disabled → no facial recognition attempted" />
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={8} />
          <Hero title={<>Group verification prevents <em>cross-group</em> misidentification</>} body="After Face Match produces a confidence score, a group membership check confirms the driver's group matches the vehicle's group before accepting the match." />
          <Section color="blue" label="Design Direction">
            <p>Three possible trip outcomes:</p>
            <p><strong>Match accepted:</strong> Face Match identifies driver AND driver group matches vehicle group.</p>
            <p><strong>Group mismatch:</strong> Face Match identifies a driver, but they belong to a different group than the vehicle. Match rejected — trip left unidentified for manual assignment.</p>
            <p><strong>Face Match disabled:</strong> Vehicle is in a group with Face Match disabled. No facial recognition attempted.</p>
          </Section>
          <Section color="rose" label="Decision">
            <Callout color="rose" header="Open Decision">
              Should group verification be a separate toggle (optional), or always-on when group-level enablement is active? The Mini PRD proposes it as a default behavior. Enterprise customers with shared drivers across divisions may want it off.
            </Callout>
          </Section>
        </>
      ),
    },
    // Step 9
    {
      title: 'Audit Trail — GLSLog History',
      lhs: (
        <>
          <div className="state-tag">S9 — Compliance audit</div>
          <WebFrame
            breadcrumb={<>Admin › <span className="bc-link">Group Level Settings</span> › Audit Log</>}
            activeNav="Admin"
          >
            <div style={{ fontSize: '0.82rem', fontWeight: 700, marginBottom: 4 }}>Face Match Settings — Change History</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--warm-gray-5)', marginBottom: 16 }}>All changes are logged with user identity, source, and timestamp.</div>
            <AuditRow color="blue" action="Face Match enabled for Northeast Division" detail='Source: GLS Profile "Northeast Division Safety Settings" · Applied to 342 vehicles' time="May 1, 2026 · 2:15 PM · by Sarah Chen (Fleet Admin)" />
            <AuditRow color="blue" action="Face Match enabled for Southeast Division" detail="Source: Driver ID Settings group picker · Applied to 287 vehicles" time="May 1, 2026 · 2:18 PM · by Sarah Chen (Fleet Admin)" />
            <AuditRow color="teal" action="Vehicle override: Face Match disabled for Truck #3310" detail="Source: Vehicle-level override · Reason: Driver privacy request" time="May 1, 2026 · 3:02 PM · by Sarah Chen (Fleet Admin)" />
            <AuditRow color="rose" action="Face Match disabled for Western Union Region" detail="Source: GLS Profile · Reason: Union agreement — no biometric capture" time="May 1, 2026 · 2:20 PM · by Sarah Chen (Fleet Admin)" />
            <AuditRow color="green" action="Truck #1098 added to Northeast Division" detail="Face Match automatically inherited from group profile" time="May 1, 2026 · 4:30 PM · System (auto-inheritance)" />
          </WebFrame>
        </>
      ),
      rhs: (
        <>
          <StepBadge n={9} />
          <Hero title={<>Every change is <em>auditable</em></>} body="The GLSLog provides a complete record of who changed Face Match settings, when, from which surface, and why. Critical for union compliance and biometric consent tracking." />
          <Section color="amber" label="Data">
            <p>The audit log captures changes from both entry points — GLS Profiles and the Driver ID group picker. Fleet admins can filter by group, vehicle, or user to trace any configuration change.</p>
          </Section>
          <Section color="blue" label="Design Direction">
            <p>This audit capability comes free from the GLS framework — the GLSLog table is already built into the Phase 2 architecture. No additional DI team work required for this.</p>
          </Section>
          <Section color="rose" label="Decision">
            <Callout color="blue" header="Summary">
              Group-level Face Match enablement via GLS Phase 2, with a bidirectional group picker in Driver ID settings and group verification at match time. Self-service, auditable, and inheritable — zero engineering tickets needed.
            </Callout>
          </Section>
        </>
      ),
    },
  ]
}

/* ------------------------------------------------------------------ */
/*  Shared components                                                  */
/* ------------------------------------------------------------------ */

function WebFrame({ children, breadcrumb, activeNav }: { children: React.ReactNode; breadcrumb: React.ReactNode; activeNav: string }) {
  return (
    <div className="web-frame">
      <div className="web-nav">
        <div className="logo">MOTIVE</div>
        {['Fleet Dashboard', 'Admin', 'Safety'].map(n => (
          <div key={n} className={`nav-item${n === activeNav ? ' active' : ''}`}>{n}</div>
        ))}
      </div>
      <div className="web-breadcrumb">{breadcrumb}</div>
      <div className="web-content">{children}</div>
    </div>
  )
}

function SettingsSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="settings-section">
      <div className="settings-label">{title}</div>
      {subtitle && <div className="settings-sublabel">{subtitle}</div>}
      {children}
    </div>
  )
}

function ToggleRow({ label, sub, on, style }: { label: string; sub?: string; on?: boolean; style?: React.CSSProperties }) {
  return (
    <div className="toggle-row" style={style}>
      <div><div className="label">{label}</div>{sub && <div className="sub">{sub}</div>}</div>
      <div className={`toggle ${on ? 'on' : 'off'}`} />
    </div>
  )
}

function GroupRow({ name, count, enabled, checked }: { name: string; count: string; enabled?: boolean; checked?: boolean }) {
  return (
    <div className="group-row">
      <div className={`cb${checked ? ' checked' : ''}`} />
      <div className="g-name">{name}</div>
      <div className="g-count">{count}</div>
      <div className={`g-badge ${enabled ? 'badge-enabled' : 'badge-disabled'}`}>{enabled ? 'Enabled' : 'Disabled'}</div>
    </div>
  )
}

function InfoCallout({ color, icon, children, style }: { color: string; icon: string; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className={`info-callout ic-${color}`} style={style}>
      <div className="ic-icon">{icon}</div>
      <div>{children}</div>
    </div>
  )
}

function ProfileCard({ name, desc, highlight, children }: { name: string; desc: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div className={`profile-card${highlight ? ' focus-ring' : ''}`} style={highlight ? { borderColor: 'var(--blue)' } : undefined}>
      <div className="pc-name">{name}</div>
      <div className="pc-desc">{desc}</div>
      {children}
    </div>
  )
}

function ProfileSetting({ name, sub, on, highlight }: { name: string; sub?: string; on?: boolean; highlight?: boolean }) {
  return (
    <div className="pc-setting" style={highlight ? { background: 'var(--blue-light)', border: '1px solid rgba(60,123,212,0.15)' } : undefined}>
      <div style={{ flex: 1 }}>
        <div className="s-name" style={{ fontSize: '0.75rem' }}>{name}</div>
        {sub && <div style={{ fontSize: '0.65rem', color: 'var(--warm-gray-5)', marginTop: 2 }}>{sub}</div>}
      </div>
      <div className={`toggle ${on ? 'on' : 'off'}`} style={{ width: 32, height: 18 }} />
    </div>
  )
}

function Chip({ enabled, children }: { enabled?: boolean; children: React.ReactNode }) {
  return (
    <span style={{
      fontSize: '0.6rem', padding: '2px 6px', borderRadius: 10, fontWeight: 700,
      background: enabled ? '#dcfce7' : 'var(--warm-gray-1)',
      color: enabled ? '#166534' : 'var(--warm-gray-5)',
    }}>{children}</span>
  )
}

function ChatMsg({ initials, color, name, children }: { initials: string; color: string; name: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: `var(--${color}-light)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: `var(--${color})`, flexShrink: 0 }}>{initials}</div>
      <div style={{ background: 'var(--warm-white)', borderRadius: '0 10px 10px 10px', padding: '10px 14px', fontSize: '0.78rem', maxWidth: '85%' }}>
        <div style={{ fontWeight: 700, fontSize: '0.72rem', marginBottom: 4, color: 'var(--warm-dark)' }}>{name}</div>
        {children}
      </div>
    </div>
  )
}

function InhRow({ vehicle, group, enabled, source, bold }: { vehicle: string; group: string; enabled?: boolean; source: 'group' | 'vehicle' | 'inherited'; bold?: boolean }) {
  const srcLabel = source === 'group' ? 'Group Profile' : source === 'vehicle' ? 'Vehicle Override' : 'Inherited'
  const srcClass = `src src-${source}`
  return (
    <tr>
      <td style={bold ? { fontWeight: 700 } : undefined}>{vehicle}</td>
      <td>{group}</td>
      <td style={{ color: enabled ? '#166534' : 'var(--rose)', fontWeight: 700 }}>{enabled ? 'Enabled' : 'Disabled'}</td>
      <td><span className={srcClass}>{srcLabel}</span></td>
    </tr>
  )
}

function TripResult({ initials, name, sub, status, statusText, detail, highlight }: { initials: string; name: string; sub: string; status: 'matched' | 'blocked' | 'unmatched'; statusText: string; detail: string; highlight?: boolean }) {
  const cls = status === 'matched' ? 'ts-matched' : status === 'blocked' ? 'ts-blocked' : 'ts-unmatched'
  return (
    <div className={`trip-result${highlight ? ' focus-ring' : ''}`} style={highlight ? { borderColor: 'var(--rose)' } : undefined}>
      <div className="trip-header">
        <div className="trip-avatar">{initials}</div>
        <div className="trip-meta"><div className="tm-name">{name}</div><div className="tm-sub">{sub}</div></div>
      </div>
      <div className={`trip-status ${cls}`}>{statusText}</div>
      <div style={{ fontSize: '0.68rem', color: 'var(--warm-gray-5)', marginTop: 6 }}>{detail}</div>
    </div>
  )
}

function AuditRow({ color, action, detail, time }: { color: string; action: string; detail: string; time: string }) {
  const bg = color === 'green' ? '#166534' : `var(--${color})`
  return (
    <div className="audit-row">
      <div className="audit-dot" style={{ background: bg }} />
      <div className="audit-content">
        <div className="ac-action">{action}</div>
        <div className="ac-detail">{detail}</div>
        <div className="ac-time">{time}</div>
      </div>
    </div>
  )
}

// RHS helpers
function StepBadge({ n }: { n: number }) {
  return <div className="r-step-badge">{n} / 9 step</div>
}

function Hero({ title, body }: { title: React.ReactNode; body: string }) {
  return (
    <div className="r-hero">
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  )
}

function Section({ color, label, children }: { color: string; label: string; children: React.ReactNode }) {
  return (
    <div className="r-section">
      <div className="r-section-header">
        <div className={`r-dot r-dot-${color}`} />
        <div className="r-section-label">{label}</div>
      </div>
      <div className="r-body">{children}</div>
    </div>
  )
}

function Quote({ text, attr }: { text: string; attr: string }) {
  return (
    <div className="r-quote">
      <div className="q-text">{text}</div>
      <div className="q-attr">{attr}</div>
    </div>
  )
}

function Stat({ num, label }: { num: string; label: string }) {
  return (
    <div className="r-stat">
      <div className="s-num">{num}</div>
      <div className="s-label">{label}</div>
    </div>
  )
}

function Callout({ color, header, children }: { color: string; header: string; children: React.ReactNode }) {
  return (
    <div className={`r-call call-${color}`}>
      <div className="rc-header">{header}</div>
      <div className="rc-body">{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function ConceptWalkthrough() {
  const [cur, setCur] = useState(0)
  const allSteps = steps()

  const go = useCallback((dir: number) => {
    setCur(prev => Math.max(0, Math.min(allSteps.length - 1, prev + dir)))
  }, [allSteps.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'ArrowRight') go(1)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [go])

  const s = allSteps[cur]

  return (
    <>
      <div className="top-bar">
        <div className="title">Face Match Group Enablement — Concept</div>
        <div>Navigate: <kbd>←</kbd> <kbd>→</kbd> arrow keys</div>
      </div>

      <div className="panels">
        <div className="lhs">{s.lhs}</div>
        <div className="rhs">{s.rhs}</div>
      </div>

      <div className="bottom-bar">
        <button className="nav-btn" disabled={cur === 0} onClick={() => go(-1)}>← Prev</button>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flex: 1 }}>
          <div className="step-title">{s.title}</div>
          <div className="dots">
            {allSteps.map((_, i) => (
              <div key={i} className={`dot${i === cur ? ' active' : ''}`} onClick={() => setCur(i)} />
            ))}
          </div>
        </div>
        <button className={`nav-btn${cur < allSteps.length - 1 ? ' primary' : ''}`} disabled={cur === allSteps.length - 1} onClick={() => go(1)}>
          {cur === allSteps.length - 1 ? 'Done' : 'Next →'}
        </button>
      </div>
    </>
  )
}
