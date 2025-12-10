    const data = {
      user: { name: "Barly Vallendito", avatar: "avatar.jpg" },
      balance: { total: 80201.5, updated: "December 21, 2020 - 02:20 PM" },
      card: {
        number: "4771 6080 1080 7889",
        name: "FINCARD",
        expiry: "08/25",
        type: "VISA",
      },
      transactions: [
        {
          id: 1,
          title: "Paypal - Received",
          date: "20 December 2020, 08:20 AM",
          amount: 8200.0,
          type: "credit",
          source: "paypal",
        },
        {
          id: 2,
          title: "Spotify Premium",
          date: "19 December 2020, 07:25 PM",
          amount: -199.0,
          type: "debit",
          source: "spotify",
        },
        {
          id: 3,
          title: "Transferwise - Received",
          date: "7 December 2020, 10:15 AM",
          amount: 1200.0,
          type: "credit",
          source: "transfer",
        },
        {
          id: 4,
          title: "H&M Payment",
          date: "15 December 2020, 06:30 PM",
          amount: -2200.0,
          type: "debit",
          source: "hm",
        },
      ],
      expenses: { percent: 85.5, total: 1820.8 },
      invoices: [
        {
          id: 1,
          datetime: "20 December 2020, 09:15 AM",
          number: "INV-10021",
          recipient: "Acme Studio",
          status: "Paid",
          amount: 480.2,
        },
        {
          id: 2,
          datetime: "19 December 2020, 04:35 PM",
          number: "INV-10022",
          recipient: "Spotify AB",
          status: "Paid",
          amount: 199.0,
        },
        {
          id: 3,
          datetime: "18 December 2020, 11:10 AM",
          number: "INV-10023",
          recipient: "Transferwise Ltd",
          status: "Pending",
          amount: 1200.0,
        },
        {
          id: 4,
          datetime: "15 December 2020, 05:00 PM",
          number: "INV-10024",
          recipient: "H&M Europe",
          status: "Overdue",
          amount: 2200.0,
        },
        {
          id: 5,
          datetime: "10 December 2020, 02:45 PM",
          number: "INV-10025",
          recipient: "Cloudify Inc.",
          status: "Paid",
          amount: 680.75,
        },
        {
          id: 6,
          datetime: "7 December 2020, 09:05 AM",
          number: "INV-10026",
          recipient: "Global Media",
          status: "Pending",
          amount: 980.0,
        },
      ],
    };

    const state = {
      transactionsFilterDays: 30,
      invoicesSearch: "",
      darkMode: false,
      maxTransactionDate: null,
    };

    // Função: inicializar barra lateral (estado ativo, etc.)
    function getFirstName(fullName) {
      return fullName.split(" ")[0] || fullName;
    }

    function updateSidebarUserName(firstName) {
      const sidebarUserName = document.getElementById("sidebar-user-name");
      if (sidebarUserName) {
        sidebarUserName.textContent = firstName;
      }
    }

    function activateNavButton(clickedButton, allButtons) {
      allButtons.forEach((btn) => btn.classList.remove("is-active"));
      clickedButton.classList.add("is-active");
    }

    function setupNavigationButtons() {
      const navButtons = document.querySelectorAll(".sidebar-item-btn");
      navButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          activateNavButton(btn, navButtons);
        });
      });
    }

    function renderSidebar() {
      const firstName = getFirstName(data.user.name);
      updateSidebarUserName(firstName);
      setupNavigationButtons();
    }

    // Função: cabeçalho (perfil, saudação, tema)
    function getUserInitials(fullName) {
      return fullName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "US";
    }

    function updateUserNameDisplay(name) {
      const userName = document.getElementById("user-name");
      if (userName) userName.textContent = name;
    }

    function updateAvatarDisplay(initials) {
      const avatar = document.getElementById("user-avatar");
      if (avatar) avatar.textContent = initials;
    }

    function renderHeader() {
      updateUserNameDisplay(data.user.name);
      const initials = getUserInitials(data.user.name);
      updateAvatarDisplay(initials);
    }

    function renderDebitCard() {
      const cardNumberEl = document.getElementById("card-number");
      const cardHolderEl = document.getElementById("card-holder");
      const cardExpiryEl = document.getElementById("card-expiry");
      const cardNameEl = document.getElementById("card-name");
      const cardTypeLabel = document.getElementById("card-type-label");

      if (cardNumberEl) cardNumberEl.textContent = formatCardNumber(data.card.number);
      if (cardHolderEl) cardHolderEl.textContent = data.user.name;
      if (cardExpiryEl) cardExpiryEl.textContent = data.card.expiry;
      if (cardNameEl) cardNameEl.textContent = data.card.name;
      if (cardTypeLabel) cardTypeLabel.textContent = data.card.type;
    }

    function renderBalance() {
      const balanceValueEl = document.getElementById("balance-value");
      const balanceUpdatedEl = document.getElementById("balance-updated");

      if (balanceValueEl) balanceValueEl.textContent = formatCurrency(data.balance.total);
      if (balanceUpdatedEl) {
        balanceUpdatedEl.textContent = `Atualizado em ${data.balance.updated}`;
      }
    }

    function renderExpensesGauge() {
      const expensesPercentEl = document.getElementById("expenses-percent");
      const expensesTotalEl = document.getElementById("expenses-total");
      const gaugeValuePath = document.getElementById("gauge-value");

      if (expensesPercentEl) expensesPercentEl.textContent = data.expenses.percent.toFixed(1);
      if (expensesTotalEl) expensesTotalEl.textContent = formatCurrency(data.expenses.total);

      if (gaugeValuePath && typeof gaugeValuePath.getTotalLength === "function") {
        const length = gaugeValuePath.getTotalLength();
        const ratio = Math.max(0, Math.min(100, data.expenses.percent)) / 100;
        gaugeValuePath.style.strokeDasharray = String(length);
        gaugeValuePath.style.strokeDashoffset = String(length * (1 - ratio));
      }
    }

    function renderCards() {
      renderDebitCard();
      renderBalance();
      renderExpensesGauge();
    }

    function createSkeletonLoader() {
      const row = document.createElement("li");
      row.className = "skeleton-row";

      const avatar = document.createElement("div");
      avatar.className = "skeleton-avatar";

      const line1 = document.createElement("div");
      line1.className = "skeleton-line";

      const line2 = document.createElement("div");
      line2.className = "skeleton-line";
      line2.style.width = "60%";

      const textWrap = document.createElement("div");
      textWrap.style.display = "flex";
      textWrap.style.flexDirection = "column";
      textWrap.style.gap = "4px";
      textWrap.appendChild(line1);
      textWrap.appendChild(line2);

      const amount = document.createElement("div");
      amount.className = "skeleton-line amount-skeleton";

      row.appendChild(avatar);
      row.appendChild(textWrap);
      row.appendChild(amount);

      return row;
    }

    function showTransactionsSkeleton(list) {
      list.innerHTML = "";
      for (let i = 0; i < 4; i += 1) {
        list.appendChild(createSkeletonLoader());
      }
    }

    function updateFilterChipsState(filterDays) {
      const filterChips = document.querySelectorAll(".filter-chip");
      filterChips.forEach((chip) => {
        const days = Number(chip.getAttribute("data-transaction-range"));
        const isActive = days === filterDays;
        chip.classList.toggle("is-active", isActive);
        chip.setAttribute("aria-pressed", String(isActive));
      });
    }

    function filterTransactionsByDateRange(filterDays) {
      if (!state.maxTransactionDate || !filterDays) {
        return data.transactions;
      }

      const threshold = new Date(state.maxTransactionDate.getTime());
      threshold.setDate(threshold.getDate() - (filterDays - 1));
      return data.transactions.filter((t) => t.dateObj >= threshold);
    }

    function createTransactionElement(tx) {
      const li = document.createElement("li");
      li.className = "transaction-item";

      const icon = document.createElement("div");
      icon.className = `transaction-icon tx-${tx.source}`;
      icon.textContent = getTransactionIconText(tx.source);
      icon.setAttribute("aria-hidden", "true");

      const textWrap = document.createElement("div");
      textWrap.className = "transaction-text";

      const title = document.createElement("div");
      title.className = "transaction-title";
      title.textContent = tx.title;

      const date = document.createElement("div");
      date.className = "transaction-date";
      date.textContent = tx.date;

      textWrap.appendChild(title);
      textWrap.appendChild(date);

      const amount = document.createElement("div");
      amount.className =
        "transaction-amount " + (tx.amount >= 0 ? "amount-credit" : "amount-debit");
      const sign = tx.amount > 0 ? "+" : "";
      amount.textContent = `${sign}${formatCurrency(tx.amount)}`;

      li.appendChild(icon);
      li.appendChild(textWrap);
      li.appendChild(amount);

      return li;
    }

    function createEmptyTransactionMessage() {
      const empty = document.createElement("li");
      empty.textContent = "Nenhuma transação nesse período.";
      empty.style.fontSize = "0.8rem";
      empty.style.color = "var(--text-muted)";
      empty.style.padding = "0.5rem 0.3rem";
      return empty;
    }

    function displayTransactionsList(list, filtered) {
      list.innerHTML = "";

      if (filtered.length === 0) {
        list.appendChild(createEmptyTransactionMessage());
      } else {
        filtered
          .slice()
          .sort((a, b) => b.dateObj - a.dateObj)
          .forEach((tx) => {
            list.appendChild(createTransactionElement(tx));
          });
      }

      list.setAttribute("aria-busy", "false");
    }

    function renderTransactions(filterDays) {
      state.transactionsFilterDays = filterDays;
      const list = document.getElementById("transactions-list");
      if (!list) return;

      list.setAttribute("aria-busy", "true");
      showTransactionsSkeleton(list);
      updateFilterChipsState(filterDays);

      setTimeout(() => {
        const filtered = filterTransactionsByDateRange(filterDays);
        displayTransactionsList(list, filtered);
      }, 400);
    }

    function handleThemeToggle() {
      const newTheme = state.darkMode ? "light" : "dark";
      applyTheme(newTheme);
      try {
        localStorage.setItem("dashboard-theme", newTheme);
      } catch (e) {}
    }

    function handleSidebarToggle() {
      const dashboard = document.getElementById("dashboard");
      if (dashboard) {
        dashboard.classList.toggle("sidebar-open");
      }
    }

    function handleCardNumberInput(event) {
      const cleaned = event.target.value.replace(/\D+/g, "").slice(0, 16);
      event.target.value = cleaned.replace(/(.{4})/g, "$1 ").trim();
    }

    function handleCardFormSubmit(event, form) {
      event.preventDefault();
      if (validateCardForm(form)) {
        updateCardData(form);
        alert("Cartão salvo com sucesso!");
        closeCardModal();
      }
    }

    function updateCardData(form) {
      const number = form.cardNumber.value;
      const name = form.cardholderName.value;
      const expiry = form.cardExpiry.value;
      const type = form.cardType.value || data.card.type;

      data.card.number = number;
      data.card.expiry = expiry;
      data.card.name = type.toUpperCase();

      updateCardDisplay(number, name, expiry, type);
    }

    function updateCardDisplay(number, name, expiry, type) {
      const cardNumberEl = document.getElementById("card-number");
      const cardHolderEl = document.getElementById("card-holder");
      const cardExpiryEl = document.getElementById("card-expiry");
      const cardNameEl = document.getElementById("card-name");
      const cardTypeLabel = document.getElementById("card-type-label");

      if (cardNumberEl) cardNumberEl.textContent = formatCardNumber(number);
      if (cardHolderEl) cardHolderEl.textContent = name;
      if (cardExpiryEl) cardExpiryEl.textContent = expiry;
      if (cardNameEl) cardNameEl.textContent = type.toUpperCase();
      if (cardTypeLabel) cardTypeLabel.textContent = type.toUpperCase();
    }

    function handleInvoiceSearch(event) {
      state.invoicesSearch = event.target.value.toLowerCase();
      renderInvoices();
    }

    function setupThemeEvents() {
      const themeToggle = document.getElementById("theme-toggle");
      if (themeToggle) {
        themeToggle.addEventListener("click", handleThemeToggle);
      }
    }

    function setupSidebarEvents() {
      const sidebarToggle = document.getElementById("sidebar-toggle");
      if (sidebarToggle) {
        sidebarToggle.addEventListener("click", handleSidebarToggle);
      }
    }

    function setupCardModalEvents() {
      const cardModal = document.getElementById("card-modal");
      const addCardBtn = document.getElementById("add-card-btn");
      const cardModalClose = document.getElementById("card-modal-close");
      const cardCancelBtn = document.getElementById("card-cancel-btn");

      if (cardModal) {
        cardModal.addEventListener("click", (event) => {
          if (event.target === cardModal) {
            closeCardModal();
          }
        });
      }

      if (addCardBtn) {
        addCardBtn.addEventListener("click", () => openCardModal());
      }

      if (cardModalClose) {
        cardModalClose.addEventListener("click", () => closeCardModal());
      }

      if (cardCancelBtn) {
        cardCancelBtn.addEventListener("click", () => closeCardModal());
      }

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeCardModal();
        }
      });
    }

    function setupCardFormEvents() {
      const cardForm = document.getElementById("card-form");
      const cardNumberInput = document.getElementById("card-number-input");

      if (cardForm) {
        cardForm.addEventListener("submit", (event) => handleCardFormSubmit(event, cardForm));
      }

      if (cardNumberInput) {
        cardNumberInput.addEventListener("input", handleCardNumberInput);
      }
    }

    function setupTransactionFilterEvents() {
      const filterChips = document.querySelectorAll(".filter-chip");
      filterChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          const days = Number(chip.getAttribute("data-transaction-range"));
          renderTransactions(days);
        });
      });
    }

    function setupInvoiceEvents() {
      const invoiceSearch = document.getElementById("invoice-search");
      const exportBtn = document.getElementById("export-invoices-btn");

      if (invoiceSearch) {
        invoiceSearch.addEventListener("input", handleInvoiceSearch);
      }

      if (exportBtn) {
        exportBtn.addEventListener("click", () => exportInvoicesCSV());
      }
    }

    function initEvents() {
      setupThemeEvents();
      setupSidebarEvents();
      setupCardModalEvents();
      setupCardFormEvents();
      setupTransactionFilterEvents();
      setupInvoiceEvents();
    }

    function getMoonIconSVG() {
      return '<path d="M5 3.3A7.5 7.5 0 0 0 12.7 15 6.5 6.5 0 1 1 5 3.3Z" fill="currentColor" />';
    }

    function getSunIconSVG() {
      return '<path d="M12 3.1A1 1 0 0 1 13 4v2a1 1 0 1 1-2 0V4a1 1 0 0 1 1-0.9zm6.36 3.54a1 1 0 0 1 0 1.41l-1.42 1.42a1 1 0 1 1-1.41-1.42l1.41-1.41a1 1 0 0 1 1.42 0zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm8 3a1 1 0 0 1 0 2h-2a1 1 0 1 1 0-2h2zm-4.05 6.05a1 1 0 0 1 1.41 0l1.42 1.41a1 1 0 0 1-1.41 1.42l-1.42-1.42a1 1 0 0 1 0-1.41zM12 18a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm-7.36-2.95a1 1 0 0 1 1.41 0l1.42 1.42a1 1 0 1 1-1.41 1.41L4.64 16.5a1 1 0 0 1 0-1.41zM4 11a1 1 0 0 1 0 2H2a1 1 0 0 1 0-2h2zm1.64-5.36a1 1 0 0 1 1.41 0l1.42 1.41A1 1 0 0 1 7.05 8.5L5.64 7.09a1 1 0 0 1 0-1.41z" fill="currentColor" />';
    }

    function updateThemeIcon(isDarkMode) {
      const themeIcon = document.getElementById("theme-icon");
      if (themeIcon) {
        themeIcon.innerHTML = isDarkMode ? getMoonIconSVG() : getSunIconSVG();
      }
    }

    function applyTheme(theme) {
      const root = document.documentElement;
      const themeToggle = document.getElementById("theme-toggle");

      root.setAttribute("data-theme", theme);
      state.darkMode = theme === "dark";

      if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(state.darkMode));
      }

      updateThemeIcon(state.darkMode);
    }

    function openCardModal() {
      const modal = document.getElementById("card-modal");
      const nameInput = document.getElementById("cardholder-name");
      if (modal) {
        modal.classList.remove("hidden");
        if (nameInput) {
          setTimeout(() => nameInput.focus(), 20);
        }
      }
    }

    function closeCardModal() {
      const modal = document.getElementById("card-modal");
      if (modal) {
        modal.classList.add("hidden");
      }
    }

    function formatCardNumber(number) {
      const cleaned = String(number).replace(/\D+/g, "");
      return cleaned.replace(/(.{4})/g, "$1 ").trim();
    }

    function formatCurrency(value) {
      const sign = value < 0 ? -1 : 1;
      const abs = Math.abs(value);
      const formatted = abs.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
      return sign < 0 ? `-${formatted}` : formatted;
    }

    function parseTransactionDates() {
      data.transactions.forEach((tx) => {
        const parsed = new Date(tx.date);
        tx.dateObj = isNaN(parsed.getTime()) ? new Date() : parsed;
      });
      state.maxTransactionDate = data.transactions.reduce((max, tx) => {
        return !max || tx.dateObj > max ? tx.dateObj : max;
      }, null);
    }

    function getTransactionIconText(source) {
      switch (source) {
        case "paypal":
          return "P";
        case "spotify":
          return "S";
        case "transfer":
          return "T";
        case "hm":
          return "H";
        default:
          return "?";
      }
    }

    function validateCardholderName(name) {
      if (!name) {
        alert("Informe o nome do titular do cartão.");
        return false;
      }
      return true;
    }

    function validateCardNumber(numberRaw) {
      if (!/^\d{16}$/.test(numberRaw)) {
        alert("O número do cartão deve conter exatamente 16 dígitos.");
        return false;
      }
      return true;
    }

    function validateCardExpiry(expiry) {
      if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        alert("A validade deve estar no formato MM/YY.");
        return false;
      }

      const [mm] = expiry.split("/").map((p) => parseInt(p, 10));
      if (mm < 1 || mm > 12) {
        alert("Mês de validade inválido.");
        return false;
      }

      return true;
    }

    function validateCardCVV(cvv) {
      if (!/^\d{3,4}$/.test(cvv)) {
        alert("O CVV deve conter 3 ou 4 dígitos.");
        return false;
      }
      return true;
    }

    function validateCardForm(form) {
      const name = form.cardholderName.value.trim();
      const numberRaw = form.cardNumber.value.replace(/\D+/g, "");
      const expiry = form.cardExpiry.value.trim();
      const cvv = form.cardCvv.value.trim();

      return (
        validateCardholderName(name) &&
        validateCardNumber(numberRaw) &&
        validateCardExpiry(expiry) &&
        validateCardCVV(cvv)
      );
    }

    function filterInvoices(search) {
      if (!search) return data.invoices;

      return data.invoices.filter((inv) => {
        return (
          inv.number.toLowerCase().includes(search) ||
          inv.recipient.toLowerCase().includes(search)
        );
      });
    }

    function sortInvoicesByDate(invoices) {
      return invoices.slice().sort((a, b) => new Date(b.datetime) - new Date(a.datetime));
    }

    function getStatusClassName(status) {
      const statusLower = status.toLowerCase();
      if (statusLower === "paid") return "status-pill status-paid";
      if (statusLower === "pending") return "status-pill status-pending";
      return "status-pill status-overdue";
    }

    function createInvoiceStatusCell(status) {
      const tdStatus = document.createElement("td");
      const statusSpan = document.createElement("span");
      statusSpan.className = getStatusClassName(status);
      statusSpan.innerHTML = `<span class="badge-status">${status}</span>`;
      tdStatus.appendChild(statusSpan);
      return tdStatus;
    }

    function createInvoiceActionCell(invoiceNumber) {
      const tdAction = document.createElement("td");
      const viewBtn = document.createElement("button");
      viewBtn.type = "button";
      viewBtn.className = "btn-link";
      viewBtn.textContent = "View";
      viewBtn.setAttribute("aria-label", `Ver detalhes da invoice ${invoiceNumber}`);
      tdAction.appendChild(viewBtn);
      return tdAction;
    }

    function createInvoiceRow(inv) {
      const tr = document.createElement("tr");

      const tdDate = document.createElement("td");
      tdDate.textContent = inv.datetime;

      const tdNumber = document.createElement("td");
      tdNumber.textContent = inv.number;

      const tdRecipient = document.createElement("td");
      tdRecipient.textContent = inv.recipient;

      const tdStatus = createInvoiceStatusCell(inv.status);
      const tdAction = createInvoiceActionCell(inv.number);

      const tdAmount = document.createElement("td");
      tdAmount.style.textAlign = "right";
      tdAmount.textContent = formatCurrency(inv.amount);

      tr.appendChild(tdDate);
      tr.appendChild(tdNumber);
      tr.appendChild(tdRecipient);
      tr.appendChild(tdStatus);
      tr.appendChild(tdAction);
      tr.appendChild(tdAmount);

      return tr;
    }

    function createEmptyInvoiceRow() {
      const row = document.createElement("tr");
      const cell = document.createElement("td");
      cell.colSpan = 6;
      cell.textContent = "Nenhuma invoice encontrada para o critério informado.";
      cell.style.fontSize = "0.8rem";
      cell.style.color = "var(--text-muted)";
      row.appendChild(cell);
      return row;
    }

    function renderInvoices() {
      const tbody = document.getElementById("invoice-body");
      if (!tbody) return;

      tbody.innerHTML = "";

      const filtered = filterInvoices(state.invoicesSearch);

      if (filtered.length === 0) {
        tbody.appendChild(createEmptyInvoiceRow());
        return;
      }

      const sorted = sortInvoicesByDate(filtered);
      sorted.forEach((inv) => {
        tbody.appendChild(createInvoiceRow(inv));
      });
    }

    function escapeCSVValue(val) {
      const str = String(val ?? "");
      const escaped = str.replace(/"/g, '""');
      if (/[",\n]/.test(escaped)) {
        return `"${escaped}"`;
      }
      return escaped;
    }

    function convertToCSVRow(cols) {
      return cols.map(escapeCSVValue).join(",");
    }

    function generateCSVContent() {
      const header = ["Date & Time", "Invoice #", "Recipient", "Status", "Amount"];
      const rows = data.invoices.map((inv) => [
        inv.datetime,
        inv.number,
        inv.recipient,
        inv.status,
        inv.amount,
      ]);

      const allRows = [header, ...rows];
      return allRows.map(convertToCSVRow).join("\n");
    }

    function downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }

    function exportInvoicesCSV() {
      const csv = generateCSVContent();
      downloadFile(csv, "invoices.csv", "text/csv;charset=utf-8;");
    }

    function getStoredTheme() {
      try {
        const stored = localStorage.getItem("dashboard-theme");
        if (stored === "light" || stored === "dark") {
          return stored;
        }
      } catch (e) {}
      return null;
    }

    function getSystemTheme() {
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        return "dark";
      }
      return "light";
    }

    function initTheme() {
      const theme = getStoredTheme() || getSystemTheme();
      applyTheme(theme);
    }

    // Funções para o modal de enviar/transferir dinheiro
function openSendModal() {
  const modal = document.getElementById("send-modal");
  const typeSelect = document.getElementById("transaction-type");
  if (modal) {
    modal.classList.remove("hidden");
    if (typeSelect) {
      setTimeout(() => typeSelect.focus(), 20);
    }
  }
}

function closeSendModal() {
  const modal = document.getElementById("send-modal");
  if (modal) {
    modal.classList.add("hidden");
    // Reset form
    const form = document.getElementById("send-form");
    if (form) form.reset();
    toggleRecipientField();
  }
}

function toggleRecipientField() {
  const typeSelect = document.getElementById("transaction-type");
  const recipientField = document.getElementById("recipient-field");
  
  if (typeSelect && recipientField) {
    if (typeSelect.value === "transfer") {
      recipientField.style.display = "block";
    } else {
      recipientField.style.display = "none";
    }
  }
}

function handleSendFormSubmit(event) {
  event.preventDefault();
  const form = event.target;
  
  if (validateSendForm(form)) {
    processTransaction(form);
    closeSendModal();
  }
}

function validateSendForm(form) {
  const type = form.transactionType.value;
  const amount = parseFloat(form.transactionAmount.value);
  const recipient = form.recipientAccount ? form.recipientAccount.value : "";
  
  if (!type) {
    alert("Selecione o tipo de transação.");
    return false;
  }
  
  if (!amount || amount <= 0) {
    alert("Informe um valor válido maior que zero.");
    return false;
  }
  
  if (type === "transfer" && !recipient.trim()) {
    alert("Informe a conta do destinatário para transferência.");
    return false;
  }
  
  if (type === "withdraw" && amount > data.balance.total) {
    alert("Saldo insuficiente para esta retirada.");
    return false;
  }
  
  return true;
}

function processTransaction(form) {
  const type = form.transactionType.value;
  const amount = parseFloat(form.transactionAmount.value);
  const description = form.transactionDescription.value || getDefaultDescription(type);
  const recipient = form.recipientAccount ? form.recipientAccount.value : "";
  
  let newBalance = data.balance.total;
  let transactionAmount = amount;
  
  switch (type) {
    case "deposit":
      newBalance += amount;
      addTransaction(description, amount, "credit", "transfer");
      break;
      
    case "withdraw":
      newBalance -= amount;
      transactionAmount = -amount;
      addTransaction(description, -amount, "debit", "transfer");
      break;
      
    case "transfer":
      newBalance -= amount;
      transactionAmount = -amount;
      addTransaction(`Transferência para ${recipient}`, -amount, "debit", "transfer");
      break;
  }
  
  // Atualizar saldo
  data.balance.total = newBalance;
  data.balance.updated = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Atualizar display
  renderBalance();
  renderTransactions(state.transactionsFilterDays);
  
  // Mostrar confirmação
  showTransactionConfirmation(type, amount, recipient);
}

function getDefaultDescription(type) {
  switch (type) {
    case "deposit": return "Depósito na conta";
    case "withdraw": return "Retirada da conta";
    case "transfer": return "Transferência entre contas";
    default: return "Transação bancária";
  }
}

function addTransaction(title, amount, type, source) {
  const newTransaction = {
    id: Date.now(), // ID único baseado no timestamp
    title: title,
    date: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    dateObj: new Date(),
    amount: amount,
    type: type,
    source: source
  };
  
  // Adicionar no início do array para aparecer primeiro
  data.transactions.unshift(newTransaction);
}

function showTransactionConfirmation(type, amount, recipient = "") {
  let message = "";
  
  switch (type) {
    case "deposit":
      message = `Depósito de ${formatCurrency(amount)} realizado com sucesso!`;
      break;
    case "withdraw":
      message = `Retirada de ${formatCurrency(amount)} realizada com sucesso!`;
      break;
    case "transfer":
      message = `Transferência de ${formatCurrency(amount)} para ${recipient} realizada com sucesso!`;
      break;
  }
  
  alert(message);
}

// Configurar eventos do modal de enviar
function setupSendModalEvents() {
  const sendModal = document.getElementById("send-modal");
  const sendBtn = document.querySelector('.btn-primary[aria-label="Enviar dinheiro"]');
  const sendModalClose = document.getElementById("send-modal-close");
  const sendCancelBtn = document.getElementById("send-cancel-btn");
  const transactionType = document.getElementById("transaction-type");

  if (sendModal) {
    sendModal.addEventListener("click", (event) => {
      if (event.target === sendModal) {
        closeSendModal();
      }
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", openSendModal);
  }

  if (sendModalClose) {
    sendModalClose.addEventListener("click", closeSendModal);
  }

  if (sendCancelBtn) {
    sendCancelBtn.addEventListener("click", closeSendModal);
  }

  if (transactionType) {
    transactionType.addEventListener("change", toggleRecipientField);
  }
}

function setupSendFormEvents() {
  const sendForm = document.getElementById("send-form");
  if (sendForm) {
    sendForm.addEventListener("submit", handleSendFormSubmit);
  }
}

    function init() {
      initTheme();
      parseTransactionDates();
      renderSidebar();
      renderHeader();
      renderCards();
      renderTransactions(state.transactionsFilterDays);
      renderInvoices();
      initEvents();
    }

    function initEvents() {
      setupThemeEvents();
      setupSidebarEvents();
      setupCardModalEvents();
      setupCardFormEvents();
      setupTransactionFilterEvents();
      setupInvoiceEvents();
      setupSendModalEvents(); 
      setupSendFormEvents();  
    }

    window.addEventListener("DOMContentLoaded", init);
