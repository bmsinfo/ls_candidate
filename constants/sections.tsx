/* eslint-disable react/no-unescaped-entities */
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const handleGoBack = () => {
  window.close();
  if (window.opener) {
    window.opener.focus();
  }
};

export const sections = [
  {
    title: 'Introduction',
    slug: 'introduction',
    content: (
      <div className="flex flex-col space-y-3">
        <p className="mb-4">
          NeuralWaves Systems Private Limited ("the Company", "We", "Us" or
          "Our") is committed to protecting your Personal Data (defined below).
          This Privacy Policy sets out the policies and procedures through which
          We collect, use, disclose, transfer, and store your Personal Data.
        </p>
        <p>
          We will only collect and use your Personal Data in accordance with the
          Information Technology Act, 2000 (“IT Act”) read with the Information
          Technology (Reasonable Security Practices and Procedures and Sensitive
          Personal Data or Information) Rules, 2011 (“SPDI Rules”), or the
          Digital Personal Data Protection Act, 2023 (as and when different
          provisions come into force from time to time) as amended or updated
          from time to time (and any other such laws that may be enacted in
          India related to the governance of personal data from time to time) as
          well as this Privacy Policy and such other term(s) in the agreement(s)
          that You may contract with Us or have contracted with Us.
        </p>
        <p>
          This Privacy Policy sets out the types of Data (defined below)
          including Personal Data that we collect from you through the Website
          (defined below), as well as the manner in which We collect, use,
          disclose, transfer to third parties, store and protect your Personal
          Data. This Privacy Policy also identifies the rights and options
          available to You with respect to your Personal Data and the manner in
          which You may reach out to Us should You have any concerns or queries
          regarding this Privacy Policy.
        </p>
        <p>
          We are committed to protecting your Personal Data through Reasonable
          Security Practices and Procedures (defined below) in accordance with
          Applicable Laws (defined below). Should You choose to not provide Us
          with the requested Personal Data, We may be unable to offer You the
          Services (defined below).
        </p>
        <p>
          You are advised to carefully read the Privacy Policy before using the
          Website / Services or any other platform, application or channels for
          communicating with Us or sharing any Data including Personal Data with
          Us. We shall not be liable / responsible for any breach of privacy
          owing to your negligence. Please note that the Website and other
          digital platforms may contain links to third party applications /
          digital platforms which are provided for your convenience. We are only
          responsible for the privacy practices and security of the Website. We
          recommend that You check the privacy and security policies and
          procedures of each and every other application / digital platform that
          You visit.
        </p>
        <p>
          All capitalized terms not defined in the Privacy Policy shall have the
          meanings ascribed to them in the Terms and Conditions of the Website,
          which can be accessed here.
        </p>
      </div>
    ),
  },
  {
    title: 'Definitions',
    slug: 'definitions',
    content: (
      <div className="flex flex-col space-y-3">
        <p className="mb-4">
          Capitalised terms not defined in the Terms shall mean as follows:{' '}
        </p>
        <li className="mb-4">
          ‘Account’ means a unique account created for You to access our Service
          or parts of the Service.
        </li>
        <li>
          ‘Affiliate’ means an entity that controls, is controlled by or is
          under common control with a party, where ‘control’ means ownership of
          50% or more of the shares, equity interest or other securities
          entitled to vote for election of directors or other managing
          authority. Affiliates for the purpose of this Privacy Policy include
          Our parent company and any other subsidiaries, joint venture partners
          or other companies that We control or that are under common control
          with Us.
        </li>
        <li>
          ‘Applicable Laws’ mean all provisions of laws, statutes, ordinances,
          rules, regulations, permits, certificates, judgments, decisions,
          decrees or orders of any governmental authority applicable to a
          natural person and includes the Information Technology Act 2000,
          Information Technology (Reasonable Security Practices and Procedures
          and Sensitive Personal Data or Information) Rules 2011, and the
          Digital Personal Data Protection Act 2023 (as and when different
          provisions come into force from time to time), as amended from time to
          time.
        </li>
        <li>
          ‘Data’ means and includes a representation of information, knowledge,
          facts, concepts or instructions which are being prepared or have been
          prepared in a formalized manner, and is intended to be processed, is
          being processed or has been processed in a computer system or computer
          network, and may be in any form (including computer printouts,
          magnetic or optical storage media, punched cards, punched tapes) or
          stored internally in the memory of the computer.
        </li>
        <li>
          ‘Company’ (referred to as either "the Company", "We", "Us" or "Our" in
          this Privacy Policy) means NeuralWaves Systems Private Limited, Pune,
          India.
        </li>

        <li>
          ‘Cookies’ mean small files that are placed on your Device containing
          the details of your browsing history on the Website among its many
          uses, which allows a website or application to remember your actions
          or preferences for a certain period of time.
        </li>
        <li>‘Country’ means Maharashtra, India.</li>
        <li>
          ‘Device’ means any device that can access the Service such as a
          computer, a cellphone or a digital tablet.
        </li>
        <li>
          ‘Personal Data’ means any information that relates directly or
          indirectly to an identified or identifiable individual.
        </li>
        <li>
          ‘Reasonable Security Practices and Procedures’ means security
          practices and procedures designed to protect such information from
          unauthorized access, damage, use, modification, disclosure or
          impairment, as may be specified in an agreement between the parties or
          as may be specified in any law for the time being in force and in the
          absence of such agreement or any law, such reasonable security
          practices and procedures, as may be prescribed by the Central
          Government in consultation with such professional bodies or
          associations as it may deem fit.
        </li>
        <li>Service’ means the Website owned and operated by the Company.</li>
        <li>
          ‘Service Provider’ means any natural or legal person who processes
          Data on behalf of the Company. It refers to third-party companies or
          individuals employed by the Company to facilitate the Service, to
          provide the Service on behalf of the Company, to perform services
          related to the Service or to assist the Company in analyzing how the
          Service is used.
        </li>
        <li>
          ‘Usage Data’ means the Data collected automatically, either generated
          by the use of the Service or from the Service infrastructure itself
          (for example, the duration of a page visit).
        </li>
        <li>
          ‘Website’ means LegoSapien, accessible from{' '}
          <a href="https://neuralwavesystems.com">
            https://neuralwavesystems.com
          </a>
          .
        </li>
        <li>
          ‘You’ means the individual accessing or using the Service, or the
          company, or other legal entity on behalf of which such individual is
          accessing or using the Service, as applicable. All references to ‘You’
          shall include yourself and any other persons You are authorised to and
          required to provide consent for.
        </li>
      </div>
    ),
  },
  {
    title: 'Collecting and using your Personal Data',
    slug: 'collecting-and-using-your-personal-data',
    content: (
      <div className="flex flex-col space-y-3">
        <h3>Types of Data Collected</h3>

        <li>
          While using Our Service, We may ask You to provide Us with certain
          Personal Data that can be used to contact or identify You. Personal
          Data may include, but is not limited to:{' '}
        </li>
        <li>
          Personal information such as your email address, first name and last
          name, phone number, date of birth, nationality;{' '}
        </li>
        <li>
          Device information such as device hardware information, device model
          and software version, App version, mobile country code and network
          code, device operating system versions, phone number and your device
          setting in accessing the Website;{' '}
        </li>
        <li>Usage Data (as detailed further below); </li>
        <li>
          Any other Personal Data not mentioned herein that You provide to Us or
          collected by Us in the course of your dealing with Us and/or where we
          require You to provide other Personal Data depending on the nature of
          Our business and its circumstances, the nature of your transaction and
          so forth; and{' '}
        </li>

        <li>
          Where You are a company, We may collect Personal Data of your
          employees. For the avoidance of doubt, You shall obtain the consent of
          the employees before providing Us with employees’ Personal Data.{' '}
        </li>

        <p>Usage Data. </p>
        <li>Usage Data is collected automatically when using the Service. </li>
        <li>
          Usage Data may include information such as Your Device's Internet
          Protocol address (e.g. IP address), browser type, browser version, the
          pages of our Service that You visit, the time and date of Your visit,
          the time spent on those pages, unique device identifiers and other
          diagnostic data.{' '}
        </li>
        <li>
          When You access the Service by or through a mobile device, We may
          collect certain information automatically, including, but not limited
          to, the type of mobile device You use, Your mobile device unique ID,
          the IP address of Your mobile device, Your mobile operating system,
          the type of mobile Internet browser You use, unique device identifiers
          and other diagnostic data.
        </li>
        <li>
          We may also collect information that Your browser sends whenever You
          visit our Service or when You access the Service by or through a
          mobile device.
        </li>
      </div>
    ),
  },
  {
    title: 'Tracking technologies and Cookies ',
    slug: 'tracking-technologies-and-cookies',
    content: (
      <div className="flex flex-col space-y-3">
        <p className="mb-4">
          We use Cookies and similar tracking technologies to track the activity
          on Our Service and store certain information. Tracking technologies
          used are beacons, tags, and scripts to collect and track information
          and to improve and analyze Our Service. The technologies We use may
          include:
        </p>
        <li>
          Cookies or browser Cookies. You can instruct your browser to refuse
          all Cookies or to indicate when a Cookie is being sent. However, if
          You do not accept Cookies, You may not be able to use some parts of
          our Service. Unless you have adjusted Your browser setting so that it
          will refuse Cookies, our Service may use Cookies.
        </li>
        <li>
          Web Beacons. Certain sections of our Service and our emails may
          contain small electronic files known as web beacons (also referred to
          as clear gifs, pixel tags, and single-pixel gifs) that permit the
          Company, for example, to count users who have visited those pages or
          opened an email and for other related website statistics (for example,
          recording the popularity of a certain section and verifying system and
          server integrity).
        </li>
        <li>
          Cookies can be "Persistent" or "Session" Cookies. Persistent Cookies
          remain on your Device when You go offline, while Session Cookies are
          deleted as soon as You close your web browser. You can learn more
          about Cookies on
          [TermsFeedwebsite](https://www.termsfeed.com/blog/cookies/#What_Are_Cookies).
        </li>

        <div className=" my-2 flex flex-col  space-y-3">
          <h3 className="font-bold">
            We use both Session and Persistent Cookies for the purposes set out
            below:{' '}
          </h3>
          <ol className="list-outside *:pl-5   *:marker:font-bold *:my-1">
            <li>Necessary / Essential Cookies</li>
            <li>Type: Session Cookies</li>
            <li>Administered by: Us</li>
            <li>
              Purpose: These Cookies are essential to provide You with Services
              available through the Website and to enable You to use some of its
              features. They help to authenticate users and prevent fraudulent
              use of user accounts. Without these Cookies, the Services that You
              have asked for cannot be provided, and We only use these Cookies
              to provide You with those Services.
            </li>
          </ol>

          <ol className="list-outside *:pl-5   *:marker:font-bold *:my-1">
            <li>Cookies Policy / Notice Acceptance Cookies </li>
            <li>type: Persistent Cookies</li>
            <li>Administered by: Us</li>
            <li>
              purpose: These Cookies identify if users have accepted the use of
              Cookies on the Website.
            </li>
          </ol>

          <ol className="list-outside *:pl-5   *:marker:font-bold *:my-1">
            <li>Functionality Cookies </li>
            <li>type: Persistent Cookies</li>
            <li>Administered by: Us</li>
            <li>
              purpose: These Cookies allow Us to remember choices You make when
              You use the Website, such as remembering your login details or
              language preference. The purpose of these Cookies is to provide
              You with a more personal experience and to avoid You having to
              re-enter your preferences every time You use the Website.
            </li>
          </ol>
        </div>
        <p>
          For more information about the Cookies We use and your choices
          regarding Cookies, please visit our Cookies Policy.
        </p>
      </div>
    ),
  },
  {
    title: 'Use of your Personal Data',
    slug: 'use-of-your-personal-data',
    content: (
      <div className="flex flex-col space-y-3">
        <p className="mb-4">
          The Company may use Personal Data for the following purposes:
        </p>
        <li>
          To provide and maintain our Service, including to monitor the usage of
          our Service.
        </li>
        <li>
          To manage your registration as a user of the Service. The Personal
          Data You provide can give You access to different functionalities of
          the Service that are available to You as a registered user.
        </li>
        <li>
          For the performance of a contract, which includes the development,
          compliance and undertaking of the purchase contract for the products,
          items or Services You have purchased or of any other contract with Us
          through the Service.
        </li>
        <li>
          To contact You by email, telephone calls, SMS, or other equivalent
          forms of electronic communication, such as a mobile application's push
          notifications regarding updates or informative communications related
          to the functionalities, products or contracted services, including the
          security updates, when necessary or reasonable for their
          implementation.{' '}
        </li>
        <li>
          To provide You with news, special offers and general information about
          other goods, services and events which We offer that are similar to
          those that You have already purchased or enquired about unless You
          have opted not to receive such information.
        </li>
        <li>
          To manage Your requests: To attend and manage Your requests to Us.
        </li>
        <li>
          For business transfers: We may use Your information to evaluate or
          conduct a merger, divestiture, restructuring, reorganization,
          dissolution, or other sale or transfer of some or all of Our assets,
          whether as a going concern or as part of bankruptcy, liquidation, or
          similar proceeding, in which Personal Data held by Us about our
          Service users is among the assets transferred.
        </li>
        <li>
          For other purposes: We may use Your information for other purposes,
          such as data analysis, identifying usage trends, determining the
          effectiveness of Our promotional campaigns and to evaluate and improve
          our Service, products, services, marketing and your experience.
        </li>

        <p className="font-bold">
          We may share your Personal Data in the following situations:{' '}
        </p>

        <li>
          With Service Providers: We may share Your Personal Data with Service
          Providers to monitor and analyze the use of our Service, to contact
          You.{' '}
        </li>
        <li>
          For business transfers: We may share or transfer Your Personal Data in
          connection with, or during negotiations of, any merger, sale of
          Company assets, financing, or acquisition of all or a portion of Our
          business to another company.{' '}
        </li>
        <li>
          With Our group entities and Affiliates: We may share Your Personal
          Data with Our group entities and Affiliates, in which case We will
          require such group entities and Affiliates to honor this Privacy
          Policy.{' '}
        </li>
        <li>
          purpose: These Cookies allow Us to remember choices You make when You
          use the Website, such as remembering your login details or language
          preference. The purpose of these Cookies is to provide You with a more
          personal experience and to avoid You having to re-enter your
          preferences every time You use the Website.
        </li>
        <li>
          With business partners: We may share Your Personal Data with Our
          business partners to offer You certain products, services or
          promotions.{' '}
        </li>
        <li>
          With other users: when You share Personal Data or otherwise interact
          in the public areas with other users, such Personal Data may be viewed
          by all users and may be publicly distributed outside.{' '}
        </li>
        <li>
          With your consent: We may disclose your Personal Data for any other
          purpose with your prior consent.{' '}
        </li>

        <div className="flex flex-col space-y-3">
          <h3 className="font-bold">Retention of your Personal Data. </h3>
          <li>
            The Company will retain your Personal Data only for as long as is
            necessary for the purposes set out in this Privacy Policy. We will
            retain and use your Personal Data to the extent necessary to comply
            with Our legal obligations (for example, if We are required to
            retain your data to comply with applicable laws), resolve disputes,
            and enforce Our legal agreements and policies.
          </li>

          <li>
            The Company will also retain Usage Data for internal analysis
            purposes. Usage Data is generally retained for a shorter period of
            time, except when this Data is used to strengthen the security or to
            improve the functionality of Our Service, or We are legally
            obligated to retain this Data for longer time periods.
          </li>
        </div>

        <div className="flex flex-col space-y-3">
          <h3 className="font-bold ">Transfer of your Personal Data. </h3>
          <li>
            Your Data, including Personal Data, is processed at the Company's
            operating offices and in any other places where the parties involved
            in the processing are located. It means that this Data may be
            transferred to — and maintained on — computers located outside of
            Your state, province, country or other governmental jurisdiction
            where the data protection laws may differ than those from Your
            jurisdiction.
          </li>
          <li>
            Your consent to this Privacy Policy followed by your submission of
            such Data represents your agreement to such transfer(s) of your Data
            (including Perosnal Data).
          </li>
          <li>
            The Company will take all steps reasonably necessary to ensure that
            your Data is treated securely and in accordance with this Privacy
            Policy and no transfer of your Personal Data will take place to an
            organization or a country unless there are adequate controls in
            place including the security of your Data including Personal Data.
          </li>{' '}
          <li>
            The Company shall undertake all Reasonable Security Practices and
            Procedures prescribed under Applicable Laws to ensure that the
            confidentiality of your information (including your Personal Data)
            is maintained by third parties to whom it discloses such
            information.
          </li>
          <li>
            The Company may be required to disclose your Personal Data to
            statutory authorities or other persons in connection with any legal
            process that may be initiated by such authorities in accordance with
            Applicable Laws, or for any risk mitigations purposes undertaken by
            us. However, this does not include selling or otherwise disclosing
            your Personal Data for commercial purposes in violation of this
            Privacy Policy and Applicable Laws.
          </li>
        </div>

        <div className="flex flex-col space-y-3">
          <h3 className="font-bold">Delete your Personal Data. </h3>
          <li>
            You have the right to delete or request that We assist in deleting
            the Personal Data that We have collected about You.
          </li>

          <li>
            Our Service may give You the ability to delete certain Data about
            You from within the Service.
          </li>

          <li>
            You may update, amend, or delete Your Personal Data at any time by
            signing in to your account, if you have one, and visiting the
            account settings section that allows You to manage Your Personal
            Data . You may also contact Us to request access to, correct, or
            delete any Personal Data that You have provided to Us.
          </li>

          <li>
            Please note, however, that We may need to retain certain Personal
            Data when We have a legal obligation or lawful basis to do so.
          </li>
        </div>
        <div className="flex flex-col space-y-3">
          <h3 className="font-bold">Disclosure of your Personal Data. </h3>
          <li>
            Business Transactions : If the Company is involved in a merger,
            acquisition or asset sale, your Personal Data may be transferred. We
            will provide notice before your Personal Data is transferred and
            becomes subject to a different privacy policy.
          </li>

          <li>
            Law enforcement Under certain circumstances, the Company may be
            required to disclose your Personal Data if required to do so by law
            or in response to valid requests by public authorities (e.g. a court
            or a government agency).
          </li>

          <div className=" my-2 flex flex-col  space-y-3">
            <h3 className="font-bold">Other legal requirements</h3>
            <p>
              The Company may disclose your Personal Data in the good faith
              belief that such action is necessary to:{' '}
            </p>
            <ol className="  *:list-disc *:pl-2  *:ml-8  *:marker:font-bold *:my-1">
              <li>Comply with a legal obligation;</li>
              <li>
                Protect and defend the rights or property of the Company;{' '}
              </li>
              <li>
                Prevent or investigate possible wrongdoing in connection with
                the Service;{' '}
              </li>
              <li>
                Protect the personal safety of users of the Service or the
                public; or
              </li>
              <li>Protect against legal liability. </li>
            </ol>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: 'Consent for collection and usage of Personal Data ',
    slug: 'consent-for-collection-and-usage-of-personal-data',
    content: (
      <div className="flex flex-col space-y-3">
        <li>
          The Company only collects Data (including Personal Data) from You in
          accordance with the explicit consents obtained from You and after
          informing You about the consequences of refusing to provide Data or
          withdrawing consent for the identified purpose.
        </li>
        <li>
          The Company maintains an auditable record of such consents granted,
          modified or withdrawn.
        </li>
        <li>
          All Data provided by You (including Personal Data) is purely
          voluntary.
        </li>
        <li>
          You may also withdraw or modify your consent to collect / provide /
          share / process the Data (including your Personal Data) by
          communicating to the email ID given below in writing. However, in such
          instance, (i) You may not be able to access some or all of the
          features or pages of Website; (ii) You may not be able to avail some
          or all of Our Services; or (iii) if You have already availed Our
          Services, such Services may be withdrawn, curtailed or cancelled as
          per the terms thereof upon such withdrawal or modification of consent.{' '}
        </li>
        <li>
          In some cases, it is essential for the Data (including Personal Data)
          to be collected / retained / stored / processed / shared either
          regulatorily, or as a matter of policy or for any of the purposes
          above and You are requested not to avail the Services if You do not
          wish to provide such Data or provide consent to collect / share /
          process the same. For any queries in this regard, You may contact the
          email IDs mentioned at the end of this Privacy Policy.
        </li>

        <li>
          The Company ensures that an appropriate data privacy commitment is
          provided to You and your express consent for seeking, collecting,
          storing, utilizing and sharing Personal Data is obtained at the time
          of or before collecting Personal Data including any sensitive Personal
          Data either by the terms of this Privacy Policy or otherwise through
          the Website.
        </li>

        <li>
          All Data collected is stored in secure databases protected via a
          variety of access controls and is treated as confidential information
          by the Company. You should be careful with usage of your username and
          password by maintaining confidentiality and ensure that You do not
          knowingly or accidentally share, provide and facilitate unauthorized
          use of the same.{' '}
        </li>
        <li>
          We may also obtain your Data from independent third parties, as
          governed by their respective privacy policies, including our Service
          Providers.
        </li>
      </div>
    ),
  },
  {
    title: 'Storage of Personal Data ',
    slug: 'storage-of-personal-data',
    content: (
      <div className="flex flex-col space-y-3">
        <li>
          The Personal Data collected from You is stored at Our backend servers
          and cloud servers situated in India and other jurisdictions.
        </li>
        <li>
          We shall only collect the above-mentioned information on a need basis
          strictly for the purpose of providing You the Services.
        </li>
        <li>
          Where required by Applicable Law, We may store your Data including
          Personal Data after the identified purpose for which your Data has
          been collected is fulfilled.
        </li>
      </div>
    ),
  },
  {
    title: 'Security of Your Personal Data',
    slug: 'security-of-your-personal-data',
    content: (
      <div className="flex flex-col space-y-3">
        <li>
          The security of your Personal Data is important to Us, but remember
          that no method of transmission over the Internet, or method of
          electronic storage is 100% secure. While We strive to use commercially
          acceptable means to protect your Personal Data, We cannot guarantee
          its absolute security.
        </li>
      </div>
    ),
  },
  {
    title: "Children's privacy",
    slug: "children's-privacy",
    content: (
      <div className="flex flex-col space-y-3">
        <li>
          Our Service does not address anyone under the age of 18. We do not
          knowingly collect personally identifiable information from anyone
          under the age of 18.
        </li>

        <li>
          If You are a parent or guardian and You are aware that your child has
          provided Us with Personal Data, please contact Us. If We become aware
          that We have collected Personal Data from anyone under the age of 18
          without verification of parental consent, We take steps to remove that
          information from Our servers.{' '}
        </li>
        <li>
          If We need to rely on consent as a legal basis for processing your
          Personal Data and your country requires consent from a parent, We may
          require your parent's consent before We collect and use that Personal
          Data.{' '}
        </li>
      </div>
    ),
  },
  {
    title: 'Links to other websites',
    slug: 'links-to-other-websites',
    content: (
      <div className="flex flex-col space-y-3">
        <li>
          Our Service may contain links to other websites that are not operated
          by Us. If You click on a third party link, You will be directed to
          that third party's site. We strongly advise You to review the Privacy
          Policy of every site You visit.
        </li>

        <li>
          We have no control over and assume no responsibility for the content,
          privacy policies or practices of any third party sites or services.
        </li>
      </div>
    ),
  },
  {
    title: 'Changes to this Privacy Policy',
    slug: 'changes-to-this-privacy-policy',
    content: (
      <div className="flex flex-col space-y-3">
        <li>
          We may update Our Privacy Policy from time to time. We will notify You
          of any changes by posting the new Privacy Policy on this page.
        </li>

        <li>
          We will let You know via email and/or a prominent notice on Our
          Service, prior to the change becoming effective and update the "Last
          updated" date at the top of this Privacy Policy.
        </li>
        <li>
          You are advised to review this Privacy Policy periodically for any
          changes.{' '}
        </li>
        <li>
          Changes to this Privacy Policy are effective when they are posted on
          this page.{' '}
        </li>
      </div>
    ),
  },
  {
    title: 'Contact Us',
    slug: 'contact-us',
    content: (
      <div className="flex flex-col h-96 space-y-3">
        <div className="p-4 border-[1px] text-grayscale-dark text-base rounded-[10px] bg-background-light border-highlight-blue ">
          If you have any questions about this Privacy Policy, You can contact
          us by visiting this page on Our Website:
          <a
            className=" text-grayscale-dark px-2"
            href="https://neuralwavesystems.com/PrivacyPolicy">
            https://neuralwavesystems.com/PrivacyPolicy
          </a>
          .
        </div>

        <Button
          onClick={handleGoBack}
          className={cn(
            'bg-primary self-end text-xl p-5 text-primary-foreground hover:bg-primary/90 hover:text-primary',
          )}>
          Go Back
        </Button>
      </div>
    ),
  },
];
