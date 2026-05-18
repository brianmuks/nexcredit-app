# bursary-credit-app
# HelsB Credit
View srs document: https://docs.google.com/document/d/1hIftvbS3OqSO-JR0shBdsTNDkd2FEST-GAyLS3RC86s/edit?usp=sharing

> **Digitising a student-run peer loan network in Zambia.**  
> Replace the WhatsApp group and the paper receipt book with a shared, trusted ledger.

---

## The problem

Students on HELSB bursaries and stipends lend to each other informally. Today that means WhatsApp messages and handwritten receipts that get lost. Nobody in the network knows how many loans someone already has. A student can borrow from five different people in the same week and nobody finds out until they default.

**HelsB Credit solves one thing:** before any money moves, the lender can check — *is this person on BC, and how many open loans do they already have?*

---

## What it does

| Feature | Description |
|---|---|
| **BC validation** | Instant check — is a student a registered HELSB bursary/stipend recipient? |
| **Loan count check** | See how many open loans a student has and total amount owed — before lending |
| **Loan ledger** | Log loans digitally instead of paper receipts. Both parties get notified. |
| **Debt dashboard** | Borrowers see everything they owe in one place |
| **Overdue tracking** | Loans auto-flag as overdue when the due date passes |
| **Rep dashboard** | The student admin gets a full view of the entire network's loan activity |

---

## What it is NOT (MVP scope)

- ❌ Not a credit scoring system
- ❌ Not a goods marketplace  
- ❌ Not a mobile money integration
- ❌ Not a HELSB API consumer (BC register is maintained manually by the student rep)

These are explicitly deferred. See [SRS v2.0]([./docs/HelsB_Credit_SRS_v2.0.docx](https://docs.google.com/document/d/1hIftvbS3OqSO-JR0shBdsTNDkd2FEST-GAyLS3RC86s/edit?usp=sharing)) for the full rationale.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React PWA (Progressive Web App — no app store needed) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| Auth | JWT |
| Notifications | In-app + Africa's Talking SMS (Zambia) |
| Hosting | Fly.io / Railway |

---

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/helsb-credit.git
cd helsb-credit

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
npm run db:migrate

# Seed demo data (20 fictitious students + 10 sample loans)
npm run db:seed

# Start the development server
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/helsb_credit

# Auth
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d

# SMS (optional — in-app notifications work without this)
AFRICAS_TALKING_API_KEY=your-key
AFRICAS_TALKING_USERNAME=your-username

# App
PORT=3000
NODE_ENV=development
```

---

## Project structure

```
helsb-credit/
├── client/                  # React PWA frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── PreLoanCheck.jsx     # The core feature
│   │   │   ├── LogLoan.jsx
│   │   │   ├── BorrowerDashboard.jsx
│   │   │   ├── LenderDashboard.jsx
│   │   │   └── RepDashboard.jsx
│   │   ├── components/
│   │   └── App.jsx
│   └── public/
│
├── server/                  # Node.js + Express API
│   ├── routes/
│   │   ├── auth.js
│   │   ├── students.js      # /students/:number/check — the key endpoint
│   │   ├── loans.js
│   │   └── bc-register.js
│   ├── middleware/
│   │   ├── auth.js          # JWT verification
│   │   └── roles.js         # Role-based access control
│   ├── db/
│   │   ├── migrations/
│   │   └── seeds/
│   └── index.js
│
├── docs/
│   └── HelsB_Credit_SRS_v2.0.docx
│
├── .env.example
├── package.json
└── README.md
```

---

## Core API endpoints

```
POST   /auth/register                     Create user account
POST   /auth/login                        Authenticate → JWT

GET    /students/:student_number/check    Pre-loan check (BC status + loan count)
GET    /students/:id/profile              Student profile

POST   /loans                             Log a new loan
PATCH  /loans/:id/repaid                  Mark loan as repaid
GET    /loans?status=open                 List loans with filters

POST   /bc-register                       Add student to BC register (rep only)
GET    /dashboard/rep                     Rep summary dashboard
```

The `/students/:student_number/check` endpoint is the most important in the system. It returns:

```json
{
  "student_number": "14025831",
  "bc_status": "active",
  "bc_type": "stipend",
  "open_loans_count": 3,
  "total_owed_zmw": 900,
  "has_overdue": true,
  "overdue_days": 12
}
```

---

## User roles

| Role | Can do |
|---|---|
| **Borrower** | View own loans and debt dashboard, see own BC status |
| **Lender** | Run pre-loan check on any student, log loans, mark loans repaid |
| **Rep / Admin** | Everything above + manage BC register, view all loans, resolve disputes |

---

## Demo script (hackathon)

A 3-minute judge pitch:

1. **Show the problem** — open a WhatsApp screenshot of a student asking for a loan in a group chat. *"This is how it works today. No one knows how many loans this person already has."*

2. **Rep dashboard** — log in as the rep. *"The student who kept the notebook now has this."*

3. **Pre-loan check** — tap "Check before lending", enter student number `14025831`. Result: `Active BC · 3 open loans · K900 owed · 1 overdue`. *"For the first time, a lender can see this before any money moves."*

4. **Log a loan** — fill in amount and due date, confirm. *"Instead of a paper receipt, it goes here. Both parties get notified."*

5. **Borrower dashboard** — show Chanda's view: 4 loans, amounts, due dates. *"No more surprise defaults."*

6. **Rep overdue view** — show loans flagged red. *"The rep doesn't chase on WhatsApp anymore."*

---

## Data model (simplified)

```
bc_register       — the source of truth for who is on BC
  id, student_number (unique), full_name, university,
  bc_type, academic_year, is_active

users             — everyone with an account
  id, student_number (FK), full_name, role, password_hash

loans             — every loan ever logged (never deleted)
  id (UUID), lender_id, borrower_id, amount_zmw,
  due_date, status (open/repaid/overdue/disputed)

audit_log         — every status change, timestamped
  entity_type, entity_id, action, changed_by, changed_at
```

---

## Hackathon context

Built at **Cursor Hackathon Zambia 2025** under the **Fintech + Education** theme.

The system being digitised already exists — students have been running this informally for years via WhatsApp and paper receipts. HelsB Credit is not a new behaviour. It is the same behaviour, made transparent and trustworthy.

---

## Roadmap (post-hackathon)

- [ ] SMS reminders via Africa's Talking (2 days before due date)
- [ ] Dispute resolution workflow
- [ ] CSV export for rep backup
- [ ] Multi-campus rollout
- [ ] HELSB API integration (requires government partnership)
- [ ] Credit scoring (requires 6+ months of repayment history data)
- [ ] Mobile money disbursement (requires BoZ licensing)

---

## Contributing

This is a hackathon project. If you want to build on it:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/sms-reminders`)
3. Commit your changes
4. Open a pull request

---

## License

MIT — do whatever helps Zambian students.

---

*Built with purpose in Lusaka, Zambia.*
