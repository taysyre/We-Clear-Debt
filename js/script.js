// Custom JavaScript for We Clear Debt

(() => {
	const navbar = document.querySelector('#mainNavbar');
	if (navbar) {
		const currentPath = window.location.pathname.replace(/\/+$/, '') || '/';
		const currentPage = currentPath.split('/').pop() || 'index.html';

		navbar.querySelectorAll('a[href]').forEach((link) => {
			const linkUrl = new URL(link.href, window.location.href);
			if (linkUrl.pathname === currentPath || (currentPage === 'index.html' && linkUrl.pathname.endsWith('/index.html'))) {
				link.classList.add('is-current');
				link.setAttribute('aria-current', 'page');
			}

			link.addEventListener('click', () => {
				if (window.matchMedia('(max-width: 991.98px)').matches && window.bootstrap && window.bootstrap.Collapse) {
					window.bootstrap.Collapse.getOrCreateInstance(navbar).hide();
				}
			});
		});
	}

	const whatsappNumber = '+27 63 409 8777';
	const whatsappUrl = 'https://wa.me/27634098777?text=Hi%20I%20need%20help%20with%20debt';
	const intents = [
		{
			keywords: ['what is debt review', 'debt review', 'debt counselling', 'debt counseling', 'over indebted', 'overindebted'],
			answer: 'Debt review (also called debt counselling) is a process under South Africa\'s National Credit Act 34 of 2005. A registered debt counsellor assesses your income, expenses and credit agreements to determine whether you may be over-indebted and what options could be appropriate. Debt review does not erase debt, and eligibility or a particular repayment outcome is never guaranteed. A registered debt counsellor can assess your individual circumstances.'
		},
		{
			keywords: ['how does it work', 'process', 'steps', 'start debt review', 'assessment', 'what happens'],
			answer: 'A debt review assessment usually considers your personal and employment circumstances, income, each credit agreement, household expenses and the reason payments became difficult. The process may then involve checking legal or existing debt-review status, considering affordability, gathering supporting documents and reviewing a summary with a registered debt counsellor. A prepared proposal is not automatically approved or binding. If you want to proceed, ask the team about a secure assessment channel; please do not post personal or account details here.'
		},
		{
			keywords: ['prepare application', 'prepare an application', 'application checklist', 'what information', 'what documents', 'start application', 'apply for debt review', 'help me apply', 'how do i apply', 'how to apply'],
			answer: 'To prepare for an assessment, organise: your employment and income details; a list of each credit agreement with its balance, instalment and arrears if known; reasonable household expenses and dependants; what changed financially; any current debt-review status, summonses or other legal notices; and relevant supporting documents. You can mark unknown amounts as “not yet confirmed”—do not guess. Share identity details or documents only through a secure, authorised channel, not this general chat. A debt counsellor can confirm what is required for your case.'
		},
		{
			keywords: ['what do i need', 'documents needed', 'documents required', 'proof of income', 'document checklist', 'payslip', 'payslips', 'bank statement', 'bank statements'],
			answer: 'Documents that may help with an assessment include accepted identification, recent payslips or other proof of income, relevant recent bank statements, proof of residential address, statements for all credit agreements, a monthly expense list, dependant or maintenance information, and any relevant demand letters, summonses, court papers or previous debt-review documents. Requirements vary. Do not upload unredacted documents or share identity or banking details in this chat; ask for a secure submission method.'
		},
		{
			id: 'affordability',
			keywords: ['affordability', 'calculate affordability', 'how much can i afford', 'repayment calculation', 'monthly budget'],
			answer: 'For a rough budget estimate, subtract reasonable monthly living expenses from net monthly household income; then subtract current monthly debt instalments to see the indicative remaining amount or shortfall. This is only an estimate, not an official affordability assessment or an approved repayment offer. It may not account for irregular costs, deductions, household contributions, secured debt or other obligations. Missing or unverified figures should be marked as unknown, not assumed.'
		},
		{
			keywords: ['income', 'salary', 'gross income', 'net income', 'overtime', 'bonus', 'employed', 'employment', 'proof of income'],
			answer: 'An assessment may consider employment status, gross and net income, payslip deductions, overtime or bonuses, other income, household contributions and expected income changes. Net income is what remains after deductions; gross income is before deductions. Keep amounts clearly labelled and distinguish confirmed figures from estimates. A registered debt counsellor can explain what evidence is needed. Please do not share payslips or personal details in this chat.'
		},
		{
			keywords: ['credit agreement', 'credit agreements', 'list my debts', 'my debts', 'creditors', 'debt balances', 'arrears', 'surety'],
			answer: 'For an assessment, list each credit agreement separately—such as a personal loan, credit card, retail account, vehicle finance, home loan, overdraft or student loan—with the creditor, balance, instalment and arrears where known. Note which debts are yours and whether you only contribute to another person’s debt or may be liable as a surety. Mark unknown figures as unconfirmed and do not omit debts. Use a secure channel for account statements or identifiers.'
		},
		{
			keywords: ['expenses', 'household expenses', 'monthly costs', 'budget expenses', 'dependants', 'food', 'rent', 'utilities', 'school fees', 'maintenance'],
			answer: 'A budget assessment may include reasonable monthly housing, food, utilities, transport, medical and insurance costs, dependant-related costs, school fees, maintenance and other essential obligations. Use genuine amounts and include costs that do not occur every month as a reasonable monthly estimate where possible. Do not reduce or misstate expenses to influence an assessment; a counsellor can help identify missing items.'
		},
		{
			keywords: ['financial difficulty', 'why am i struggling', 'lost income', 'retrenchment', 'income loss', 'emergency', 'cost of living', 'borrow to pay'],
			answer: 'A counsellor may ask what changed—for example increased living costs, reduced income, retrenchment, an emergency, or borrowing to cover existing payments—and what changes you expect. This context helps explain your budget; it does not by itself determine eligibility. You can describe the situation in general terms here, without sharing identifying or account details, and discuss specifics through a secure assessment.'
		},
		{
			keywords: ['qualify', 'eligible', 'eligibility', 'who can', 'requirements'],
			answer: 'Eligibility depends on your full financial circumstances and the applicable legal requirements, including your income, expenses and debts. A registered debt counsellor must assess your situation; this bot cannot confirm acceptance or make a formal determination. You can request a professional assessment through the Contact page.'
		},
		{
			keywords: ['marital status', 'married', 'marriage regime', 'previous application', 'applied before', 'previous debt review'],
			answer: 'A professional assessment may ask about marital status, any relevant marriage regime, employment status, financial difficulty and previous debt-review applications because these can affect the information needed. The relevance depends on your circumstances. You do not need to share your full name, ID number or documents in this chat; ask the team for a secure assessment channel.'
		},
		{
			keywords: ['credit score', 'credit record', 'credit bureau', 'credit profile'],
			answer: 'Debt review is recorded with credit bureaus and generally restricts access to new credit while you are under review. The effect on your credit profile and how it is updated after completion depend on your case. Ask your debt counsellor or credit bureau about your individual record.'
		},
		{
			keywords: ['new credit', 'borrow', 'take out credit', 'credit card', 'access credit', 'get a loan'],
			answer: 'Debt review generally restricts taking on additional credit while you are under review, subject to the applicable law and circumstances. Do not take out new credit to alter an assessment. Ask your registered debt counsellor before making a decision about credit.'
		},
		{
			keywords: ['use my account', 'existing accounts', 'credit account', 'credit provider account'],
			answer: 'The effect on existing credit agreements or account access can depend on the agreement and your stage in the process. Ask your registered debt counsellor or credit provider about your particular account before changing payments or using it.'
		},
		{
			keywords: ['how long', 'duration', 'weeks', 'time to finish', 'timeline'],
			answer: 'There is no fixed timeline for everyone. The assessment, responses from credit providers, any court or tribunal process, and the amount owed all affect timing. The team can give you a more useful estimate after reviewing your details.'
		},
		{
			keywords: ['cost', 'costs', 'fee', 'fees', 'price', 'charge', 'payment'],
			answer: 'Debt counselling fees and payment-distribution arrangements depend on the services, applicable rules and your circumstances. Ask for a written breakdown explaining each fee, what it covers, how payments are distributed and the proposed process before agreeing. A proposed repayment amount is not an approved offer.'
		},
		{
			keywords: ['payment distribution', 'payment distributor', 'how are payments made', 'who do i pay'],
			answer: 'Ask the debt counsellor to explain in writing how payments are made and distributed, which authorised payment channel is used, and what fees apply. Do not change or stop payments based only on a chatbot response; confirm your individual arrangement with your counsellor.'
		},
		{
			keywords: ['missed payment', 'miss a payment', 'payment missed', 'change in income', 'income changed', 'income has dropped', 'income reduced', 'lump sum', 'secured debt instalment', 'vehicle instalment', 'home loan instalment'],
			answer: 'If you miss a payment, your income changes, or you may receive a lump sum, contact your registered debt counsellor promptly and ask how it affects your case. Keep relevant records and do not assume that a change automatically updates an arrangement or pauses legal action. The effect depends on your circumstances.'
		},
		{
			keywords: ['summons', 'court papers', 'letter of demand', 'section 86 10', 'section 86(10)', 'termination notice', 'enforcement notice', 'judgment', 'garnishee', 'does applying stop', 'will applying stop', 'does debt review stop'],
			answer: 'A debt-review application does not automatically stop every collection, enforcement or court process. A summons, judgment, demand or section 86(10) termination notice can be time-sensitive. Do not ignore deadlines or assume the notice has no effect; contact your registered debt counsellor or a suitably qualified South African legal professional promptly. The outcome depends on the facts and stage of your case.'
		},
		{
			keywords: ['cancel', 'leave', 'exit', 'remove debt review', 'withdraw', 'transfer counsellor', 'change counsellor'],
			answer: 'Withdrawal from or transfer of debt review is not always available and may depend on the process stage, any court or tribunal order, and the applicable law. Do not stop payments or rely on a promise of quick removal. Ask your registered debt counsellor or a suitably qualified legal professional about your specific options.'
		},
		{
			keywords: ['clearance certificate', 'form 19', 'paid off', 'completed debt review', 'finish debt review', 'clear debt review'],
			answer: 'A clearance certificate (NCR Form 19) is issued only when the applicable statutory requirements for your case are met. Your registered debt counsellor can confirm whether you qualify and explain the steps for credit-bureau updates. Requirements can depend on the debts involved, including a home loan; completion or a certificate is not guaranteed by this chat.'
		},
		{
			keywords: ['after clearance', 'after debt review', 'credit after debt review', 'apply for credit after'],
			answer: 'After completion, the effect on your credit record and when you may apply for credit depend on the applicable requirements and your individual record. Confirm that any required clearance and bureau updates have been completed with your debt counsellor and the relevant credit bureau before relying on your status.'
		},
		{
			keywords: ['dispute balance', 'disputed balance', 'wrong balance', 'wrong debt balance', 'incorrect balance', 'incorrect debt balance', 'credit agreement dispute', 'reckless credit', 'complain', 'complaint', 'ncr complaint'],
			answer: 'If you dispute a balance, believe information is incorrect, or want to raise a complaint, keep copies of statements and correspondence and record dates and reference numbers. A claim of reckless credit or another legal issue needs an assessment of the facts; this bot cannot decide it. Ask your registered debt counsellor or a qualified legal professional for advice, and contact the National Credit Regulator (NCR) about its complaint process where appropriate.'
		},
		{
			keywords: ['legal', 'legal rights', 'legal action', 'enforcement proceedings', 'court process'],
			answer: 'Debt review is governed by South Africa\'s National Credit Act, but legal outcomes depend on your facts and the stage of the process. Applying does not automatically stop every enforcement or court process, and this bot cannot provide a formal legal determination. For a deadline, disputed issue or legal notice, promptly contact your registered debt counsellor or a suitably qualified South African legal professional.'
		},
		{
			keywords: ['contact', 'phone', 'whatsapp', 'address', 'speak to', 'human', 'agent', 'person'],
			answer: `You can call We Clear Debt on +27 60 257 2591, visit the Contact page, or message the team on WhatsApp at ${whatsappNumber}. Please do not share your ID number, bank details, passwords, or account numbers in this chat.`
		},
		{
			keywords: ['ncr', 'registered', 'registration'],
			answer: 'We Clear Debt describes itself on this website as an NCR-registered debt counselling provider. You can verify a debt counsellor or provider through the National Credit Regulator before sharing personal information or signing an agreement.'
		},
		{
			keywords: ['summary', 'summarize', 'summarise', 'check my information', 'application summary', 'what happens after assessment'],
			answer: 'Before information is used for an application, it should be summarised for you to check. A preparation summary can include your employment status; confirmed and estimated income; living expenses; each credit agreement and any unknown balances or arrears; the reason for financial difficulty; relevant legal notices; missing documents; an indicative budget estimate; and questions needing professional follow-up. This summary is not a formal application, legal determination or approved repayment plan. Use a secure channel for personal details and documents.'
		},
		{
			keywords: ['privacy', 'share my id', 'id number', 'bank details', 'banking details', 'password', 'one time password', 'otp', 'pin', 'secure channel', 'personal information'],
			answer: 'Please do not share a full ID number, banking details, passwords, PINs, card security codes, one-time passwords or unredacted financial documents in this general chat. Only provide information needed for the task, and use a secure, authorised channel for sensitive details or documents. Check the applicable privacy notice to understand how information is used.'
		},
		{
			keywords: ['hi', 'hello', 'hey', 'good morning', 'good afternoon'],
			answer: 'Hello! I can explain debt review, eligibility, income and expense preparation, credit agreements, documents, affordability estimates, legal safeguards and completion. I can provide general information, but not a formal assessment or legal decision. What would you like to know?'
		}
	];
	const localizedIntents = [
		{
			af: ['skuldhersiening', 'skuldberading', 'wat is skuld', 'skuld hersiening'],
			xh: ['uphononongo lwamatyala', 'ityala lam', 'amatyala am', 'yintoni ityala'],
			answer: {
				af: 'Skuldhersiening (ook skuldberading genoem) is ’n proses ingevolge Suid-Afrika se Nasionale Kredietwet 34 van 2005. ’n Geregistreerde skuldberader beoordeel jou inkomste, uitgawes en kredietooreenkomste om vas te stel of jy moontlik oorverskuldig is en watter opsies gepas kan wees. Skuldhersiening skryf nie skuld af nie, en kwalifikasie of ’n bepaalde terugbetalingsuitkoms word nie gewaarborg nie. ’n Geregistreerde skuldberader moet jou individuele omstandighede beoordeel.',
				xh: 'Uphononongo lwamatyala (olukwabizwa ngokuba kukucebisa ngamatyala) yinkqubo ephantsi koMthetho weSizwe weTyala waseMzantsi Afrika ka-34 ka-2005. Umcebisi wamatyala obhalisiweyo uvavanya ingeniso yakho, iindleko nezivumelwano zetyala ukuze abone ukuba usenokuba namatyala angaphezu kwamandla akho nokuba zeziphi iindlela ezinokufaneleka. Uphononongo aluwacimi amatyala, kwaye ukufaneleka okanye isiphumo esithile sentlawulo asiqinisekiswa. Umcebisi wamatyala obhalisiweyo kufuneka avavanye imeko yakho.'
			}
		},
		{
			af: ['hoe werk', 'die proses', 'stappe', 'wat gebeur', 'assessering'],
			xh: ['isebenza njani', 'inkqubo', 'amanyathelo', 'kwenzeka ntoni', 'uvavanyo'],
			answer: {
				af: '’n Skuldhersieningsassessering kyk gewoonlik na jou persoonlike en werksomstandighede, inkomste, elke kredietooreenkoms, huishoudelike uitgawes en waarom betalings moeilik geword het. Daarna kan die proses ’n kontrole van regsake of bestaande skuldhersiening, ’n bekostigbaarheidsbeoordeling, die insameling van dokumente en ’n gesprek met ’n geregistreerde skuldberader insluit. ’n Voorstel is nie vanself goedgekeur of bindend nie. Vra die span oor ’n veilige assesseringskanaal; moenie persoonlike of rekeningbesonderhede hier plaas nie.',
				xh: 'Uvavanyo lophononongo lwamatyala ludla ngokujonga imeko yakho yobuqu nomsebenzi, ingeniso, isivumelwano ngasinye setyala, iindleko zasekhaya nesizathu sokuba kube nzima ukuhlawula. Inkqubo isenokujonga imiba yezomthetho okanye uphononongo olusele lukhona, ivavanye imali onokukwazi ukuyihlawula, iqokelele amaxwebhu ize ixoxwe nomcebisi wamatyala obhalisiweyo. Isindululo asivunywa ngokuzenzekelayo kwaye asibopheleli ngokuzenzekelayo. Buza iqela ngendlela ekhuselekileyo yokwenza uvavanyo; musa ukuthumela iinkcukacha zakho okanye zeakhawunti apha.'
			}
		},
		{
			af: ['aansoek', 'doen aansoek', 'berei voor', 'hoe doen ek aansoek', 'help my aansoek'],
			xh: ['isicelo', 'ndifuna ukufaka isicelo', 'ndingafaka isicelo', 'ndincede ngesicelo', 'lungiselela isicelo'],
			answer: {
				af: 'Berei vir ’n assessering jou werk- en inkomstebesonderhede voor; ’n lys van elke kredietooreenkoms met die saldo, paaiement en agterstallige bedrag indien bekend; redelike huishoudelike uitgawes en afhanklikes; wat finansieel verander het; enige bestaande skuldhersiening, dagvaarding of regskennisgewing; en toepaslike stawende dokumente. Merk onbekende bedrae as “nog nie bevestig nie”—moenie raai nie. Deel identiteitsbesonderhede of dokumente slegs deur ’n veilige, goedgekeurde kanaal. ’n Skuldberader kan bevestig wat vir jou saak nodig is.',
				xh: 'Ukulungiselela uvavanyo, qokelela iinkcukacha zomsebenzi nengeniso yakho; uluhlu lwesivumelwano ngasinye setyala kunye nebhalansi, isavenge nemali eshiyekileyo ukuba uyayazi; iindleko zasekhaya ezifanelekileyo nabantu obaxhasayo; into etshintshileyo ngokwemali; naluphi na uphononongo lwamatyala osele ukulo, isamani okanye isaziso somthetho; kunye namaxwebhu axhasayo afanelekileyo. Phawula imali ongayaziyo njengengakaqinisekiswa—musa ukuqikelela. Yabelana ngolwazi lwesazisi okanye ngamaxwebhu kuphela ngendlela ekhuselekileyo nevunyiweyo. Umcebisi wamatyala angakuqinisekisa oko kufunekayo kwimeko yakho.'
			}
		},
		{
			af: ['dokumente', 'watter dokumente', 'payslip', 'bankstate', 'bewys van inkomste', 'dokumentelys'],
			xh: ['amaxwebhu', 'uxwebhu', 'ngawaphi amaxwebhu', 'ubungqina bengeniso', 'isiliphu somvuzo', 'isitatimenti sebhanki'],
			answer: {
				af: 'Dokumente wat vir ’n assessering kan help, sluit aanvaarbare identifikasie, onlangse betaalstrokies of ander bewys van inkomste, toepaslike onlangse bankstate, bewys van woonadres, state vir alle kredietooreenkomste, ’n lys van maandelikse uitgawes, inligting oor afhanklikes of onderhoud, en relevante aanmanings, dagvaardings, hofstukke of vorige skuldhersieningsdokumente in. Vereistes verskil. Moenie ongeredigeerde dokumente of identiteits- of bankbesonderhede hier oplaai nie; vra vir ’n veilige indieningsmetode.',
				xh: 'Amaxwebhu anokunceda kuvavanyo aquka isazisi esamkelekileyo, iziliphu zomvuzo zakutshanje okanye obunye ubungqina bengeniso, izitatimenti zebhanki zakutshanje ezifanelekileyo, ubungqina bendawo yokuhlala, izitatimenti zazo zonke izivumelwano zetyala, uluhlu lweenkcitho zenyanga, iinkcukacha zabantu obaxhasayo okanye zesondlo, kunye nezaziso zokuhlawula, iisamani, amaphepha enkundla okanye amaxwebhu ophononongo lwamatyala lwangaphambili xa lukhona. Iimfuno ziyahluka. Musa ukufaka amaxwebhu angafihlwanga okanye iinkcukacha zesazisi nezebhanki apha; cela indlela ekhuselekileyo yokuwathumela.'
			}
		},
		{
			af: ['bekostigbaarheid', 'kan ek bekostig', 'bereken', 'maandelikse begroting'],
			xh: ['ndingakwazi ukuhlawula', 'ndinokuhlawula', 'ukufikeleleka kweentlawulo', 'ubalo lwentlawulo', 'imali eseleyo'],
			answer: {
				af: 'Vir ’n rowwe begrotingskatting, trek redelike maandelikse lewenskoste van netto maandelikse huishoudelike inkomste af; trek dan huidige maandelikse skuldpaaiemente af om ’n aanduiding van die bedrag wat oorbly of ’n tekort te kry. Dit is slegs ’n skatting, nie ’n amptelike bekostigbaarheidsbeoordeling of ’n goedgekeurde aanbod nie. Dit kan onreëlmatige koste, aftrekkings, huishoudelike bydraes, versekerde skuld of ander verpligtinge uitsluit. Merk ontbrekende of onbevestigde bedrae as onbekend; moenie dit aanneem nie.',
				xh: 'Ukuqikelela nje uhlahlo-lwabiwo mali, thabatha iindleko zokuphila zenyanga ezifanelekileyo kwingeniso yekhaya yenyanga emva kokutsalwa kwezinye iimali; emva koko thabatha izavenge zamatyala ozihlawulayo ngoku ukuze ubone imali enokushiyeka okanye intsilelo. Luqikelelo kuphela olu, alulovavanyo olusemthethweni lokukwazi ukuhlawula okanye isindululo esivunyiweyo. Isenokungabandakanyi iindleko ezingaqhelekanga, imali etsalwayo, iminikelo yasekhaya, amatyala anesiqinisekiso okanye ezinye izibophelelo. Phawula imali engekhoyo okanye engaqinisekiswanga njengengaziwayo; musa ukuyiqikelela.'
			}
		},
		{
			af: ['inkomste', 'salaris', 'verdienste', 'oortyd', 'bonus', 'werkgewer'],
			xh: ['ingeniso', 'umvuzo', 'umsebenzi', 'ixesha elongezelelweyo', 'ibhonasi'],
			answer: {
				af: '’n Assessering kan werkstatus, bruto en netto inkomste, betaalstrokie-aftrekkings, oortyd of bonusse, ander inkomste, huishoudelike bydraes en verwagte inkomsteveranderinge in ag neem. Netto inkomste is ná aftrekkings; bruto inkomste is vóór aftrekkings. Merk bedrae duidelik as bevestig of beraam. ’n Geregistreerde skuldberader kan verduidelik watter bewyse nodig is. Moenie betaalstrokies of persoonlike besonderhede hier deel nie.',
				xh: 'Uvavanyo lusenokujonga imeko yomsebenzi, ingeniso epheleleyo nengeniso eseleyo emva kokutsalwa kwezinye iimali, imali etsalwa kumvuzo, ixesha elongezelelweyo okanye iibhonasi, enye ingeniso, iminikelo yasekhaya kunye notshintsho olulindelekileyo kwingeniso. Chaza ngokucacileyo ukuba imali iqinisekisiwe okanye luqikelelo. Umcebisi wamatyala obhalisiweyo angachaza ubungqina obufunekayo. Musa ukwabelana ngeziliphu zomvuzo okanye iinkcukacha zakho apha.'
			}
		},
		{
			af: ['skulde', 'krediteure', 'kredietooreenkoms', 'agterstallig', 'saldo van my skuld'],
			xh: ['amatyala', 'ababolekisi', 'isivumelwano setyala', 'imali eshiyekileyo yetyala', 'ityala ngalinye'],
			answer: {
				af: 'Lys vir ’n assessering elke kredietooreenkoms apart—byvoorbeeld ’n persoonlike lening, kredietkaart, winkelrekening, voertuigfinansiering, huislening, oortrekking of studentelening—met die kredietgewer, saldo, paaiement en agterstallige bedrag indien bekend. Dui aan watter skuld joune is en of jy slegs tot iemand anders se skuld bydra of as borg aanspreeklik kan wees. Merk onbekende bedrae as onbevestig en moenie skuld weglaat nie. Gebruik ’n veilige kanaal vir state of rekeningidentifiseerders.',
				xh: 'Dwelisa isivumelwano ngasinye setyala ngokwahlukeneyo kuvavanyo—njengemali-mboleko yobuqu, ikhadi letyala, iakhawunti yevenkile, imali yemoto okanye yendlu, i-ovadrafti okanye imali-mboleko yabafundi—kunye negama lombolekisi, ibhalansi, isavenge nemali eshiyekileyo ukuba uyayazi. Chaza ukuba ngawaphi amatyala akho nokuba uncedisa nje ukuhlawula ityala lomnye umntu okanye unokuba noxanduva njengesiqinisekiso. Phawula imali ongayaziyo njengengaqinisekiswanga kwaye ungawashiyi amatyala ngaphandle. Sebenzisa indlela ekhuselekileyo kwizitatimenti nakwiinkcukacha zeakhawunti.'
			}
		},
		{
			af: ['uitgawes', 'huishoudelike uitgawes', 'huur', 'kos', 'nutsdienste', 'skoolgeld', 'afhanklikes'],
			xh: ['iindleko', 'iindleko zasekhaya', 'irenti', 'ukutya', 'amanzi', 'umbane', 'iifizi zesikolo', 'abantu endibaxhasayo'],
			answer: {
				af: '’n Begroting kan redelike maandelikse behuising, kos, nutsdienste, vervoer, mediese en versekeringskoste, afhanklikes, skoolgeld, onderhoud en ander noodsaaklike verpligtinge insluit. Gebruik werklike bedrae; deel ’n koste wat nie elke maand voorkom deur ’n redelike maandelikse skatting. Moenie uitgawes verminder of verkeerd voorstel om ’n assessering te beïnvloed nie.',
				xh: 'Uhlahlo-lwabiwo mali lusenokubandakanya iindleko zenyanga ezifanelekileyo zendlu, ukutya, amanzi nombane, uthutho, unyango ne-inshorensi, abantu obaxhasayo, iifizi zesikolo, isondlo nezinye izibophelelo eziyimfuneko. Sebenzisa imali eyinyani; iindleko ezingaveli qho ngenyanga ziguqulele kuqikelelo olufanelekileyo lwenyanga. Musa ukunciphisa okanye ukuchaza kakubi iindleko ukuze utshintshe iziphumo zovavanyo.'
			}
		},
		{
			af: ['finansiële probleme', 'sukkel met betalings', 'inkomste verloor', 'afleggings', 'noodgeval', 'lewenskoste gestyg'],
			xh: ['ndiyasokola ukuhlawula', 'ukuphulukana nomsebenzi', 'ndiphelelwe ngumsebenzi', 'iindleko zinyukile', 'imeko yam yezemali'],
			answer: {
				af: '’n Skuldberader kan vra wat verander het—byvoorbeeld hoër lewenskoste, ’n inkomsteverlaging, aflegging, ’n noodgeval of lenings om bestaande betalings te maak—en of verdere veranderinge verwag word. Dit help om jou begroting te verstaan, maar bepaal nie op sigself kwalifikasie nie. Jy kan die situasie hier algemeen beskryf sonder identifiserende of rekeningbesonderhede.',
				xh: 'Umcebisi wamatyala usenokubuza ukuba yintoni etshintshileyo—njengokunyuka kweendleko zokuphila, ukuncipha kwengeniso, ukuphelelwa ngumsebenzi, imeko engxamisekileyo okanye ukuboleka ukuze uhlawule amatyala akhoyo—nokuba kukho olunye utshintsho olulindelekileyo. Oku kunceda ukuqonda uhlahlo-lwabiwo mali lwakho kodwa akugqibi ukufaneleka ngokwakho. Ungayichaza ngokubanzi imeko yakho apha ngaphandle kweenkcukacha zesazisi okanye zeakhawunti.'
			}
		},
		{
			af: ['rekening gebruik', 'bestaande kredietrekening', 'kan ek my rekening gebruik'],
			xh: ['ndingasebenzisa iakhawunti', 'iiakhawunti zam', 'iakhawunti ekhoyo'],
			answer: {
				af: 'Die uitwerking op bestaande kredietooreenkomste of toegang tot ’n rekening kan afhang van die ooreenkoms en die stadium van die proses. Vra jou geregistreerde skuldberader of kredietgewer oor jou spesifieke rekening voordat jy betalings verander of dit gebruik.',
				xh: 'Indlela uphononongo oluchaphazela ngayo izivumelwano zetyala ezikhoyo okanye ukusetyenziswa kweakhawunti ixhomekeke kwisivumelwano nakwinqanaba lenkqubo. Buza umcebisi wamatyala obhalisiweyo okanye umbolekisi malunga neakhawunti yakho ngaphambi kokutshintsha iintlawulo okanye ukuyisebenzisa.'
			}
		},
		{
			af: ['gemisde betaling', 'betaling gemis', 'inkomste het verander', 'inkomste het gedaal', 'eenmalige bedrag'],
			xh: ['ndiphoswe yintlawulo', 'intlawulo endiyiphosileyo', 'ingeniso itshintshile', 'ingeniso yehlile', 'imali yesixa'],
			answer: {
				af: 'As jy ’n betaling mis, jou inkomste verander of ’n enkelbedrag ontvang, kontak jou geregistreerde skuldberader so gou moontlik en vra hoe dit jou saak raak. Hou toepaslike rekords en moenie aanvaar dat ’n verandering ’n reëling outomaties wysig of regsaksie stop nie. Die uitwerking hang van jou omstandighede af.',
				xh: 'Ukuba uphoswa yintlawulo, ingeniso yakho iyatshintsha okanye ufumana isixa semali, qhagamshelana ngokukhawuleza nomcebisi wamatyala obhalisiweyo uze ubuze ukuba kuyichaphazela njani imeko yakho. Gcina amaxwebhu afanelekileyo kwaye musa ukucinga ukuba utshintsho luya kulungisa ngokuzenzekelayo isivumelwano okanye lumise amanyathelo omthetho. Impembelelo ixhomekeke kwiimeko zakho.'
			}
		},
		{
			af: ['na klaring', 'ná skuldhersiening', 'krediet ná skuldhersiening', 'kredietrekord bywerk'],
			xh: ['emva kokugqiba', 'emva kophononongo lwamatyala', 'ityala emva kophononongo', 'hlaziya irekhodi'],
			answer: {
				af: 'Ná voltooiing hang die uitwerking op jou kredietrekord en wanneer jy vir krediet kan aansoek doen van die toepaslike vereistes en jou individuele rekord af. Bevestig met jou skuldberader en die betrokke kredietburo dat enige vereiste klaring en opdaterings afgehandel is voordat jy op jou status staatmaak.',
				xh: 'Emva kokugqitywa, impembelelo kwirekhodi yakho yetyala nokuba ungafaka nini isicelo setyala kuxhomekeke kwiimfuno ezisebenzayo nakwirekhodi lakho. Qinisekisa nomcebisi wamatyala neziko letyala ukuba isatifikethi esifunekayo kunye nohlaziyo lwenziwe ngaphambi kokuthembela kwimeko yakho.'
			}
		},
		{
			af: ['som op', 'opsomming', 'kontroleer my inligting', 'is my inligting reg'],
			xh: ['shwankathela', 'isishwankathelo', 'jonga iinkcukacha zam', 'ingaba iinkcukacha zam zichanekile'],
			answer: {
				af: 'Voordat inligting vir ’n aansoek gebruik word, behoort dit opgesom en deur jou nagegaan te word. ’n Voorbereidingsopsomming kan werkstatus, bevestigde en beraamde inkomste, uitgawes, elke kredietooreenkoms, onbekende bedrae, regskennisgewings, ontbrekende dokumente en sake vir professionele opvolg bevat. Dit is nie ’n formele aansoek, regsbeslissing of goedgekeurde terugbetalingsplan nie. Gebruik ’n veilige kanaal vir persoonlike besonderhede en dokumente.',
				xh: 'Ngaphambi kokuba kusetyenziswe iinkcukacha kwisicelo, kufuneka zishwankathelwe ukuze uzijonge. Isishwankathelo sokulungiselela sinokuquka imeko yomsebenzi, ingeniso eqinisekisiweyo neqikelelweyo, iindleko, isivumelwano ngasinye setyala, imali engaziwayo, izaziso zomthetho, amaxwebhu angekhoyo nemiba efuna ingcali. Asisosicelo esisemthethweni, isigqibo somthetho okanye isicwangciso sentlawulo esivunyiweyo. Sebenzisa indlela ekhuselekileyo kwiinkcukacha zakho nakumaxwebhu.'
			}
		},
		{
			af: ['kwalifiseer', 'geskik', 'kom ek in aanmerking', 'oorverskuldig'],
			xh: ['ndiyafaneleka', 'ndingakulungela', 'ndingafaneleka', 'ndinamatyala amaninzi'],
			answer: {
				af: 'Kwalifikasie hang af van jou volle finansiële omstandighede en toepaslike wetlike vereistes, insluitend jou inkomste, uitgawes en skuld. ’n Geregistreerde skuldberader moet jou situasie beoordeel; hierdie bot kan nie aanvaarding bevestig of ’n formele beslissing maak nie. Jy kan ’n professionele assessering deur die Kontak-blad versoek.',
				xh: 'Ukufaneleka kuxhomekeke kuyo yonke imeko yakho yezemali nakwiimfuno zomthetho ezisebenzayo, kuquka ingeniso, iindleko namatyala akho. Umcebisi wamatyala obhalisiweyo kufuneka avavanye imeko yakho; le bot ayinakuqinisekisa ukwamkelwa okanye yenze isigqibo esisemthethweni. Ungacela uvavanyo lobungcali kwiphepha loQhagamshelwano.'
			}
		},
		{
			af: ['kredietrekord', 'krediettelling', 'kredietburo'],
			xh: ['irekhodi yetyala', 'amanqaku etyala', 'iziko lamatyala'],
			answer: {
				af: 'Skuldhersiening word by kredietburo’s aangeteken en beperk gewoonlik toegang tot nuwe krediet terwyl jy onder hersiening is. Die uitwerking op jou kredietprofiel en die opdatering daarvan ná voltooiing hang van jou saak af. Vra jou skuldberader of kredietburo oor jou individuele rekord.',
				xh: 'Uphononongo lwamatyala lurekhodwa kumaziko olwazi lwamatyala kwaye ludla ngokuthintela ukufumana ityala elitsha ngoxa uphononongwa. Impembelelo kwirekhodi yakho yetyala nendlela elihlaziywa ngayo emva kokugqitywa ixhomekeke kwimeko yakho. Buza umcebisi wamatyala okanye iziko letyala malunga nerekhodi lakho.'
			}
		},
		{
			af: ['nuwe krediet', 'nog krediet', 'kan ek leen', 'kredietkaart kry'],
			xh: ['ityala elitsha', 'ndingaboleka', 'ndingafumana imali-mboleko'],
			answer: {
				af: 'Skuldhersiening beperk gewoonlik die aangaan van bykomende krediet terwyl jy onder hersiening is, onderhewig aan die wet en jou omstandighede. Moenie nuwe krediet aangaan om ’n assessering te beïnvloed nie. Vra jou geregistreerde skuldberader voordat jy ’n kredietbesluit neem.',
				xh: 'Uphononongo lwamatyala ludla ngokuthintela ukuthatha ityala elongezelelweyo ngoxa uphononongwa, ngokuxhomekeke kumthetho nakwiimeko zakho. Musa ukuthatha ityala elitsha ukuze utshintshe uvavanyo. Buza umcebisi wamatyala obhalisiweyo ngaphambi kokwenza isigqibo ngetyala.'
			}
		},
		{
			af: ['hoe lank', 'hoeveel tyd', 'tydsduur', 'hoe lank neem'],
			xh: ['kuthatha ixesha elingakanani', 'ixesha elingakanani', 'kuza kuthatha ixesha'],
			answer: {
				af: 'Daar is nie vir almal ’n vaste tydlyn nie. Die assessering, terugvoer van kredietgewers, enige hof- of tribunaalproses en die bedrag wat geskuld word, beïnvloed die tydsduur. Die span kan ’n beter skatting gee nadat jou besonderhede beoordeel is.',
				xh: 'Akukho xesha limiselweyo elifanayo kumntu wonke. Uvavanyo, iimpendulo zababolekisi, nayiphi na inkqubo yenkundla okanye yetribhinali kunye nemali etyalwayo zinokuchaphazela ixesha. Iqela linokunika uqikelelo olungcono emva kokujonga iinkcukacha zakho.'
			}
		},
		{
			af: ['fooie', 'koste', 'wat kos', 'betalingsverspreiding'],
			xh: ['iintlawulo zenkonzo', 'iindleko zenkonzo', 'ndihlawula malini', 'zisasazwa njani iintlawulo'],
			answer: {
				af: 'Skuldberadingsfooie en betalingsverspreiding hang af van die dienste, toepaslike reëls en jou omstandighede. Vra voor jy instem vir ’n skriftelike uiteensetting van elke fooi, waarvoor dit betaal, hoe betalings versprei word en hoe die proses werk. ’n Voorgestelde terugbetalingsbedrag is nie ’n goedgekeurde aanbod nie.',
				xh: 'Iintlawulo zenkonzo yokucetyiswa ngamatyala nendlela ezisasazwa ngayo iintlawulo zixhomekeke kwinkonzo, kwimigaqo esebenzayo nakwiimeko zakho. Ngaphambi kokuba uvume, cela inkcazelo ebhaliweyo yentlawulo nganye, into eyihlawulayo, indlela iintlawulo ezisasazwa ngayo nendlela esebenza ngayo inkqubo. Imali ecetywayo yokuhlawula ayisosindululo esivunyiweyo.'
			}
		},
		{
			af: ['dagvaarding', 'hofstukke', 'regskennisgewing', 'regstappe', 'hofsaak', 'afdwinging'],
			xh: ['isamani', 'ndinesamani', 'ndifumene isamani', 'amaphepha enkundla', 'isaziso somthetho', 'ityala lasenkundleni', 'amanyathelo asemthethweni'],
			priority: 1,
			answer: {
				af: '’n Aansoek om skuldhersiening stop nie outomaties elke invorderings-, afdwingings- of hofproses nie. ’n Dagvaarding, uitspraak, aanmaning of artikel 86(10)-beëindigingskennisgewing kan tydsensitief wees. Moenie sperdatums ignoreer of aanvaar dat die kennisgewing geen uitwerking het nie; kontak dadelik jou geregistreerde skuldberader of ’n toepaslik gekwalifiseerde Suid-Afrikaanse regskenner. Die uitkoms hang van die feite en stadium van jou saak af.',
				xh: 'Ukufaka isicelo sophononongo lwamatyala akuyeki ngokuzenzekelayo yonke inkqubo yokuqokelela amatyala, yokunyanzelisa intlawulo okanye yenkundla. Isamani, isigwebo, isaziso sokuhlawula okanye isaziso sokuphelisa ngokwecandelo 86(10) sinokuba nomhla obekiweyo. Musa ukungahoyi imihla ebekiweyo okanye ucinge ukuba isaziso asinampembelelo; qhagamshelana ngokukhawuleza nomcebisi wamatyala obhalisiweyo okanye igqwetha elifanelekileyo eMzantsi Afrika. Isiphumo sixhomekeke kwiinyani nakwinqanaba letyala lakho.'
			}
		},
		{
			af: ['kanselleer', 'onttrek', 'verlaat skuldhersiening', 'ander skuldberader'],
			xh: ['rhoxa', 'ndingayeka', 'ndiphume kuphononongo', 'tshintsha umcebisi'],
			answer: {
				af: 'Onttrekking aan of oordrag van skuldhersiening is nie altyd beskikbaar nie; dit kan afhang van die prosesstadium, enige hof- of tribunaalbevel en die toepaslike wet. Moenie betalings staak of ’n belofte van vinnige verwydering vertrou nie. Vra jou geregistreerde skuldberader of ’n toepaslik gekwalifiseerde regskenner oor jou spesifieke opsies.',
				xh: 'Ukurhoxa okanye ukudlulisela uphononongo lwamatyala komnye umcebisi akusoloko kuvumelekile; kuxhomekeke kwinqanaba lenkqubo, kumyalelo wenkundla okanye wetribhinali nakumthetho osebenzayo. Musa ukuyeka iintlawulo okanye ukuthembela kwisithembiso sokususwa ngokukhawuleza. Buza umcebisi wamatyala obhalisiweyo okanye igqwetha elifanelekileyo ngeendlela onokukhetha kuzo.'
			}
		},
		{
			af: ['klaringsertifikaat', 'sertifikaat', 'vorm 19', 'klaar met skuldhersiening'],
			xh: ['isatifikethi sokugqiba', 'isatifikethi sokucoca amatyala', 'ifomu 19', 'ndiwagqibile amatyala'],
			answer: {
				af: '’n Klaringsertifikaat (NCR-vorm 19) word slegs uitgereik wanneer die toepaslike statutêre vereistes vir jou saak nagekom is. Jou geregistreerde skuldberader kan bevestig of jy kwalifiseer en die stappe vir kredietburo-opdaterings verduidelik. Vereistes kan afhang van die betrokke skuld, insluitend ’n huislening; hierdie bot waarborg nie voltooiing of ’n sertifikaat nie.',
				xh: 'Isatifikethi sokugqiba (iFomu 19 ye-NCR) sikhutshwa kuphela xa iimfuno zomthetho ezisebenzayo kwimeko yakho zizalisekile. Umcebisi wamatyala obhalisiweyo unokuqinisekisa ukuba uyafaneleka aze achaze amanyathelo okuhlaziya iinkcukacha kumaziko olwazi lwamatyala. Iimfuno zinokuxhomekeka kumatyala akhoyo, kuquka imali-mboleko yendlu; le bot ayiqinisekisi ukugqitywa okanye isatifikethi.'
			}
		},
		{
			af: ['kla', 'klagte', 'verkeerde saldo', 'betwis die saldo'],
			xh: ['isikhalazo', 'ndifuna ukukhalaza', 'ibhalansi ayichanekanga', 'imali yetyala ayichanekanga'],
			answer: {
				af: 'As jy ’n saldo betwis, dink inligting is verkeerd of ’n klagte wil indien, hou afskrifte van state en korrespondensie en teken datums en verwysingsnommers aan. ’n Eis oor roekelose krediet of ’n ander regsprobleem vereis beoordeling van die feite; hierdie bot kan dit nie beslis nie. Vra jou geregistreerde skuldberader of ’n gekwalifiseerde regskenner om advies. Waar toepaslik, vra die Nasionale Kredietreguleerder (NCR) oor sy klagteproses.',
				xh: 'Ukuba awuvumelani nebhalansi, ucinga ukuba iinkcukacha azichanekanga okanye ufuna ukufaka isikhalazo, gcina iikopi zezitatimenti nembalelwano uze ubhale imihla neenombolo zesalathiso. Ibango lokubolekwa ngokungakhathali okanye omnye umba womthetho lifuna ukuvavanywa kweenyani; le bot ayinakwenza isigqibo ngalo. Cela ingcebiso kumcebisi wamatyala obhalisiweyo okanye kwigqwetha elifanelekileyo. Xa kufanelekile, buza iBhunga leSizwe leTyala (NCR) ngendlela yokufaka isikhalazo.'
			}
		},
		{
			af: ['kontak', 'telefoon', 'whatsapp', 'praat met iemand', 'menslike agent'],
			xh: ['qhagamshelana', 'umnxeba', 'inombolo yefowuni', 'thetha nomntu', 'iwhatsapp'],
			answer: {
				af: `Jy kan We Clear Debt skakel by +27 60 257 2591, die Kontak-blad besoek of die span op WhatsApp kontak by ${whatsappNumber}. Moet asseblief nie jou ID-nommer, bankbesonderhede, wagwoorde of rekeningnommers in hierdie klets deel nie.`,
				xh: `Ungatsalela umnxeba ku-We Clear Debt ku +27 60 257 2591, undwendwele iphepha loQhagamshelwano okanye uthumele umyalezo kwiqela kuWhatsApp ku ${whatsappNumber}. Nceda ungabelani ngenombolo yesazisi, iinkcukacha zebhanki, amagama ayimfihlo okanye iinombolo zeakhawunti kule ncoko.`
			}
		},
		{
			af: ['geregistreerde skuldberader', 'geregistreer'],
			xh: ['ncr', 'umcebisi obhalisiweyo', 'ubhalisiwe'],
			answer: {
				af: 'We Clear Debt beskryf homself op hierdie webwerf as ’n NCR-geregistreerde skuldberadingsverskaffer. Jy kan ’n skuldberader of verskaffer by die Nasionale Kredietreguleerder verifieer voordat jy persoonlike inligting deel of ’n ooreenkoms teken.',
				xh: 'U-We Clear Debt uzichaza kule webhusayithi njengomboneleli weenkonzo zokucetyiswa ngamatyala obhaliswe kwi-NCR. Ungaqinisekisa umcebisi wamatyala okanye umboneleli kwiBhunga leSizwe leTyala ngaphambi kokwabelana ngolwazi lwakho okanye ukusayina isivumelwano.'
			}
		},
		{
			af: ['privaatheid', 'id nommer', 'identiteitsnommer', 'bankbesonderhede', 'wagwoord', 'eenmalige wagwoord', 'veilige kanaal'],
			xh: ['ukhuseleko lweenkcukacha', 'inombolo yesazisi', 'iinkcukacha zebhanki', 'igama lokugqitha', 'iphasiwedi', 'indlela ekhuselekileyo'],
			answer: {
				af: 'Moet asseblief nie ’n volle ID-nommer, bankbesonderhede, wagwoorde, PIN’s, kaartsekuriteitskodes, eenmalige wagwoorde of ongeredigeerde finansiële dokumente in hierdie algemene klets deel nie. Gebruik slegs ’n veilige, goedgekeurde kanaal vir sensitiewe besonderhede of dokumente. Raadpleeg die toepaslike privaatheidskennisgewing om te verstaan hoe inligting gebruik word.',
				xh: 'Nceda ungabelani ngenombolo yesazisi epheleleyo, iinkcukacha zebhanki, amagama ayimfihlo, ii-PIN, iikhowudi zokhuseleko lwekhadi, ii-OTP okanye amaxwebhu emali angafihlwanga kule ncoko kawonke-wonke. Sebenzisa kuphela indlela ekhuselekileyo nevunyiweyo kwiinkcukacha okanye kumaxwebhu abuthathaka. Funda isaziso semfihlo esisebenzayo ukuze uqonde indlela olusetyenziswa ngayo ulwazi.'
			}
		},
		{
			af: ['hallo', 'goeie dag', 'goeiemore', 'goeienaand', 'dankie'],
			xh: ['molo', 'molweni', 'enkosi', 'ndicela uncedo', 'ndicela ukubuza'],
			answer: {
				af: 'Hallo! Ek kan algemene vrae oor Suid-Afrikaanse skuldhersiening, inkomste en uitgawes, dokumente en die assesseringsproses beantwoord. Ek kan nie ’n formele assessering of regsbeslissing gee nie. Waarmee kan ek jou help?',
				xh: 'Molo! Ndingaphendula imibuzo ngokubanzi ngophononongo lwamatyala eMzantsi Afrika, ingeniso neendleko, amaxwebhu nenkqubo yovavanyo. Andinakwenza uvavanyo olusemthethweni okanye isigqibo somthetho. Ndingakunceda ngantoni?'
			}
		}
	];
	const languageMarkers = {
		af: ['skuldhersiening', 'skuldberading', 'skuld', 'krediet', 'hoe werk', 'wat is', 'aansoek', 'dokumente', 'inkomste', 'salaris', 'uitgawes', 'fooie', 'dagvaarding', 'krediteure', 'betaal', 'kan ek', 'asseblief', 'hallo', 'goeie dag', 'ek wil', 'ek het', 'my skuld', 'hoeveel kos', 'wat kos', 'is ek', 'finansiele probleme', 'sukkel met betalings', 'rekening gebruik', 'gemisde betaling', 'som op'],
		xh: ['yintoni', 'ndifuna', 'ndingakwazi', 'ndingancedwa', 'ndincede', 'ndicela', 'nceda', 'enkosi', 'amatyala', 'ityala', 'ingeniso', 'umvuzo', 'iindleko', 'amaxwebhu', 'uxwebhu', 'ndihlawula', 'ingaba', 'ndingafaka', 'ndinamatyala', 'molo', 'molweni', 'obhalisiweyo', 'ixesha elingakanani', 'ndinesamani', 'ndine', 'ndiyasokola', 'iakhawunti', 'ndiphoswe', 'shwankathela', 'inkundla', 'isigwebo']
	};
	let conversationLanguage = 'en';
	const normalizeText = (text) => ` ${text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()} `;
	const suggestions = ['What is debt review?', 'What documents may I need?', 'How is affordability estimated?', 'How do I contact the team?'];
	const localizedSuggestions = {
		af: ['Wat is skuldhersiening?', 'Watter dokumente het ek nodig?', 'Hoe word bekostigbaarheid beraam?', 'Hoe kontak ek die span?'],
		xh: ['Yintoni uphononongo lwamatyala?', 'Ngawaphi amaxwebhu endiwadingayo?', 'Kuqikelelwa njani ukukwazi ukuhlawula?', 'Ndingaqhagamshelana njani neqela?']
	};

	const launcher = document.createElement('button');
	launcher.className = 'debt-chat-launcher';
	launcher.type = 'button';
	launcher.setAttribute('aria-label', 'Open debt review chat');
	launcher.setAttribute('aria-expanded', 'false');
	launcher.innerHTML = '<i class="fas fa-comment-dots" aria-hidden="true"></i><span>Ask us</span>';

	const panel = document.createElement('section');
	panel.className = 'debt-chat-panel';
	panel.setAttribute('aria-label', 'We Clear Debt chat assistant');
	panel.hidden = true;
	panel.innerHTML = `
		<header class="debt-chat-header">
			<div><strong>We Clear Debt</strong><span>Debt review assistant</span></div>
			<button class="debt-chat-close" type="button" aria-label="Close chat"><i class="fas fa-times" aria-hidden="true"></i></button>
		</header>
		<div class="debt-chat-messages" role="log" aria-live="polite" aria-relevant="additions text"></div>
		<div class="debt-chat-suggestions" aria-label="Suggested questions"></div>
		<form class="debt-chat-form">
			<label class="visually-hidden" for="debt-chat-input">Your question</label>
			<input id="debt-chat-input" type="text" maxlength="600" placeholder="Type your question..." autocomplete="off" required>
			<button type="submit" aria-label="Send message"><i class="fas fa-arrow-up" aria-hidden="true"></i></button>
		</form>
		<p class="debt-chat-note">General information only. Don't share ID, banking, password, OTP or account details here.</p>`;

	document.body.append(launcher, panel);

	const messages = panel.querySelector('.debt-chat-messages');
	const form = panel.querySelector('.debt-chat-form');
	const input = panel.querySelector('#debt-chat-input');
	const suggestionList = panel.querySelector('.debt-chat-suggestions');

	function addMessage(text, sender) {
		const message = document.createElement('p');
		message.className = `debt-chat-message debt-chat-message-${sender}`;
		if (sender === 'assistant') {
			text.split(/(https:\/\/wa\.me\/27634098777\?text=Hi%20I%20need%20help%20with%20debt|\+27 63 409 8777)/g).forEach((part) => {
				if (part === whatsappUrl || part === whatsappNumber) {
					const link = document.createElement('a');
					link.href = whatsappUrl;
					link.target = '_blank';
					link.rel = 'noopener noreferrer';
					link.textContent = part;
					link.setAttribute('aria-label', 'Chat with We Clear Debt on WhatsApp');
					message.appendChild(link);
				} else {
					message.appendChild(document.createTextNode(part));
				}
			});
		} else {
			message.textContent = text;
		}
		messages.appendChild(message);
		messages.scrollTop = messages.scrollHeight;
	}

	function updateLanguageControls() {
		if (conversationLanguage === 'en') return;
		input.placeholder = conversationLanguage === 'af' ? 'Tik jou vraag...' : 'Chwetheza umbuzo wakho...';
		const suggestionsForLanguage = localizedSuggestions[conversationLanguage];
		suggestionList.querySelectorAll('.debt-chat-suggestion').forEach((button, index) => {
			button.textContent = suggestionsForLanguage[index];
		});
	}

	function getAnswer(question) {
		const normalized = normalizeText(question);
		const languageScores = {
			af: languageMarkers.af.filter((marker) => normalized.includes(normalizeText(marker))).length,
			xh: languageMarkers.xh.filter((marker) => normalized.includes(normalizeText(marker))).length
		};
		if (languageScores.af || languageScores.xh) {
			conversationLanguage = languageScores.xh > languageScores.af ? 'xh' : 'af';
			updateLanguageControls();
		}

		const findAmount = (labels) => {
			const amountPattern = '(?:r\\s*)?([0-9][0-9, ]*(?:\\.[0-9]{1,2})?)';
			const expression = new RegExp(`(?:${labels})\\s*(?:is|of|yi|ngu|:|=)?\\s*${amountPattern}`, 'i');
			const match = normalized.match(expression);
			if (!match) return null;
			const amount = Number(match[1].replace(/[\s,]/g, ''));
			return Number.isFinite(amount) && amount >= 0 ? amount : null;
		};
		const income = findAmount('net\\s+(?:monthly\\s+)?(?:household\\s+)?income|monthly\\s+net\\s+(?:household\\s+)?income|take[- ]home\\s+pay|netto\\s+(?:maandelikse\\s+)?(?:huishoudelike\\s+)?inkomste|maandelikse\\s+netto\\s+inkomste|ingeniso(?:\\s+(?:yam|yekhaya|yenyanga))?');
		const expenses = findAmount('reasonable\\s+monthly\\s+living\\s+expenses|monthly\\s+(?:living|household)\\s+expenses|monthly\\s+expenses|living\\s+expenses|maandelikse\\s+(?:lewens?|huishoudelike\\s+)?uitgawes|lewenskoste|iindleko(?:\\s+(?:zam|zasekhaya|zenyanga))?');
		const instalments = findAmount('current\\s+monthly\\s+debt\\s+instalments|monthly\\s+debt\\s+instalments|debt\\s+instalments|monthly\\s+debt\\s+payments|debt\\s+payments|(?:maandelikse\\s+)?skuldpaaiemente|paaiemente|izavenge(?:\\s+zamatyala)?');
		const formatRand = (amount) => `${amount < 0 ? '-R ' : 'R '}${new Intl.NumberFormat('en-ZA', { maximumFractionDigits: 2 }).format(Math.abs(amount))}`;

		if (income !== null && expenses !== null && instalments !== null) {
			const beforeDebt = income - expenses;
			const remaining = beforeDebt - instalments;
			if (conversationLanguage === 'af') {
				const result = remaining < 0
					? `die syfers dui op ’n maandelikse tekort van ${formatRand(Math.abs(remaining))} ná huidige skuldpaaiemente`
					: `die aangeduide bedrag wat ná huidige skuldpaaiemente oorbly, is ${formatRand(remaining)}`;
				return `Volgens die bedrae wat jy gegee het, is die bedrag voor skuldterugbetalings ${formatRand(beforeDebt)}. Ná huidige maandelikse skuldpaaiemente ${result}. Dit is ’n voorlopige skatting wat slegs op hierdie bedrae gegrond is—nie ’n amptelike bekostigbaarheidsbeoordeling, goedgekeurde aanbod of waarborg van kwalifikasie nie. ’n Werklike beoordeling kan aftrekkings, huishoudelike bydraes, onreëlmatige uitgawes, versekerde skuld en ander verpligtinge insluit. Bevestig die bedrae deur ’n veilige assessering met ’n geregistreerde skuldberader.`;
			}
			if (conversationLanguage === 'xh') {
				const result = remaining < 0
					? `iinkcukacha zibonisa intsilelo yenyanga eyi-R ${new Intl.NumberFormat('en-ZA').format(Math.abs(remaining))} emva kwezavenge zamatyala ozihlawulayo ngoku`
					: `imali eqikelelwayo eshiyekayo emva kwezavenge zamatyala yi-${formatRand(remaining)}`;
				return `Ngokwemali oyinikeleyo, imali eshiyekayo ngaphambi kokuhlawula amatyala yi-${formatRand(beforeDebt)}. Emva kwezavenge zamatyala ozihlawulayo ngoku, ${result}. Luqikelelo lokuqala olusekelwe kule mali kuphela—asilo vavanyo olusemthethweni lokukwazi ukuhlawula, asisosindululo esivunyiweyo kwaye aluqinisekisi ukufaneleka. Uvavanyo lokwenene lusenokubandakanya imali etsalwayo, iminikelo yasekhaya, iindleko ezingaqhelekanga, amatyala anesiqinisekiso nezinye izibophelelo. Qinisekisa le mali ngovavanyo olukhuselekileyo nomcebisi wamatyala obhalisiweyo.`;
			}
			const result = remaining < 0
				? `the figures indicate a monthly shortfall of ${formatRand(Math.abs(remaining))} after current debt instalments`
				: `the indicative amount remaining after current debt instalments is ${formatRand(remaining)}`;
			return `Using the figures you provided, the amount before debt repayments is ${formatRand(beforeDebt)}. After current monthly debt instalments, ${result}. This is a provisional estimate based only on those figures—not an official affordability assessment, approved offer or guarantee of eligibility. Actual assessments may include deductions, household contributions, irregular expenses, secured debts and other obligations. Please confirm the figures through a secure assessment with a registered debt counsellor.`;
		}

		if (conversationLanguage !== 'en') {
			const rankedLocalized = localizedIntents.map((intent) => ({
				answer: intent.answer[conversationLanguage],
				priority: intent.priority || 0,
				score: intent[conversationLanguage].reduce((score, keyword) => {
					const normalizedKeyword = normalizeText(keyword);
					return score + (normalized.includes(normalizedKeyword) ? normalizedKeyword.trim().split(' ').length + 1 : 0);
				}, 0)
			})).sort((first, second) => second.score - first.score || second.priority - first.priority);

			if (rankedLocalized[0].score > 0) {
				return rankedLocalized[0].answer;
			}

			return conversationLanguage === 'af'
				? `Ek is nie seker oor daardie spesifieke vraag nie. Ek kan algemene inligting oor skuldhersiening gee. Vir advies oor jou eie saak, kontak die span op WhatsApp: ${whatsappUrl}. Moenie sensitiewe persoonlike of bankbesonderhede hier deel nie.`
				: `Andiqinisekanga ngempendulo yalo mbuzo uthile. Ndinganika ulwazi ngokubanzi ngophononongo lwamatyala. Ukuze ufumane uncedo ngemeko yakho, qhagamshelana neqela kuWhatsApp: ${whatsappUrl}. Musa ukwabelana ngolwazi lwesazisi okanye lwebhanki olubuthathaka apha.`;
		}

		const ranked = intents.map((intent) => ({
			id: intent.id,
			answer: intent.answer,
			score: intent.keywords.reduce((score, keyword) => {
				const normalizedKeyword = normalizeText(keyword);
				return score + (normalized.includes(normalizedKeyword) ? normalizedKeyword.trim().split(' ').length + 1 : 0);
			}, 0)
		})).sort((first, second) => second.score - first.score);

		if (ranked[0].score > 0) return ranked[0].answer;
		return `I don't have a reliable answer for that yet. The team can help with your specific question on WhatsApp: ${whatsappUrl}`;
	}

	function submitQuestion(question) {
		const cleanedQuestion = question.trim();
		if (!cleanedQuestion) return;
		addMessage(cleanedQuestion, 'user');
		addMessage(getAnswer(cleanedQuestion), 'assistant');
		suggestionList.hidden = true;
	}

	suggestions.forEach((suggestion) => {
		const button = document.createElement('button');
		button.className = 'debt-chat-suggestion';
		button.type = 'button';
		button.textContent = suggestion;
		button.addEventListener('click', () => submitQuestion(suggestion));
		suggestionList.appendChild(button);
	});

	addMessage('Hi! I can answer general questions about South African debt review and help you prepare for a professional assessment. Please do not share ID numbers, account details, banking information, passwords, PINs, OTPs or unredacted documents here. What would you like to know?', 'assistant');

	launcher.addEventListener('click', () => {
		panel.hidden = false;
		launcher.setAttribute('aria-expanded', 'true');
		input.focus();
	});

	panel.querySelector('.debt-chat-close').addEventListener('click', () => {
		panel.hidden = true;
		launcher.setAttribute('aria-expanded', 'false');
		launcher.focus();
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		submitQuestion(input.value);
		input.value = '';
		input.focus();
	});
})();
