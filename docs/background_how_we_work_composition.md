## Table of Contents
- [Program Background](#Program-background)
- [Current system/background of the legacy environment](#Current-systembackground-of-the-legacy-environment)
- [How We Work](#How-we-work)
- [Team Composition](#Team-composition)

## Background
### Program background 

As the EASi prime contractor, Oddball serves as the lead developer, integrator, and maintainer for the EASi application, including what has been developed previously, using an agile product management process to continuously add value for CMS customers while ensuring consistent management of these products in a way that complies with Agency and Federal policy and standards.

Oddball is also responsible for the future development of key features of the application upon request. New program offices through CMS can request additional new features and projects specific to those operating divisions and programs, and Oddball accommodates these projects as needed to include them in the EASi Application.

### Current system/background of the legacy environment 

The objective of the EASi contract is to modernize and standardize IT governance processes while promoting data sharing within the Office of Information Technology (OIT) and across CMS. For many years, the IT Governance process has been extremely difficult and time consuming for CMS Business Owners to navigate, resulting in delayed project schedules and increased contracting costs. EASi is an open source tool used to ease this burden by facilitating the system development lifecycle process for CMS business owners, who will utilize EASi for interfacing with the IT Governance processes mandated by CMS when standing up or maintaining a system. 

## Customers/Stakeholders/other collaborators:
- 	CMS OIT- Funding and product direction for the EASi application
    -	CMS Cloud teams- setting up accounts
    -	batCAVE initiative- exploring shared devops and shared/inherited security protocols
    -	IDM- Identity Management team for setting up access to the MINT application.
    -	CEDAR (and through CEDAR, CAMS/CALM)- data sources for System Profile and other EASi features
        - Customers interviewed for user research include project leads and business owners from other CMS components such as: CCSQ, OSORA, OMH, OEDA, and CM
    - Other OIT groups interviewed for user research include: DIIMP, ICPG, and front offices
-	CMS CMMI- Funding and product direction for the MINT application
    - MACs and Shared System Maintainers (CWF, FISS, MCS)  interviewed by previous contractors for user research before Oddball was on the team, and we were unable to conduct further interviews, but we are currently building features for them
    - Internal CMMI groups and teams interviewed for user research include BSG, DITOS, and front offices
## User community composition
- For the EASi System:
    - CMS Business Owners, Product Owners, and technical leads
    - CMS OIT Governance Teams (Governance Review Team, Governance Review Board, Technical Review Board, Governance Admin Team, Enterprise Architecture)
    - CMS Leadership, within OIT and at component levels
- For the MINT System:
    - CMMI Model Teams, including model IT Leads
    - CMMI and other component leadership
    - CMMI Model Intake Team
    - Medicare Administrative Contractors (MACs) and Shared System Maintainers
    - Internal CMS teams such as cost estimation, quality, grants management and contracting, and shared system product teams



## Data Sources
Our application sources data from:
-	user-submitted data from our own RDS Database
-	user data (names, emails, EUA IDs) from the Okta User API
-	system/service data from CEDAR’s “Core” API

## Technical Flexibility and Scalability
Our system and team has processes and code in place to be able to easily integrate and adapt to rapidly changing external APIs.

The EASi System surfaces comprehensive system data for all CMS systems (over 150 systems), integrating data from a variety of disparate data sources. 



## How we work 

### Team composition
| Role                 | Company | Team                                                |
|----------------------|---------|-----------------------------------------------------|
| Engineering Lead     | Oddball | Shared Leadership Team                              |
| Product Manager      | Oddball | Shared Leadership Team                              |
| User Experience Lead | Oddball | Shared Leadership Team                              |
| Program Manager      | Oddball | Shared Leadership Team                              |
| DevOps Engineer      | Oddball | Low-key Glorious Porpoises: Scrum Team 1 (OIT EASi) |
| Back End Engineer    | Oddball | Low-key Glorious Porpoises: Scrum Team 1 (OIT EASi) |
| Back End Engineer    | Oddball | Low-key Glorious Porpoises: Scrum Team 1 (OIT EASi) |
| Front End Engineer   | Oddball | Low-key Glorious Porpoises: Scrum Team 1 (OIT EASi) |
| Front End Engineer   | Oddball | Low-key Glorious Porpoises: Scrum Team 1 (OIT EASi) |
| Back End Engineer    | Oddball | Pronking Springboks: Scrum Team 2 (CMMI MINT)       |
| Back End Engineer    | Oddball | Pronking Springboks: Scrum Team 2 (CMMI MINT)       |
| DevSecOps Engineer   | Oddball | Pronking Springboks: Scrum Team 2 (CMMI MINT)       |
| UX Designer          | Oddball | Pronking Springboks: Scrum Team 2 (CMMI MINT)       |
| Front End Lead       | Oddball | Pronking Springboks: Scrum Team 2 (CMMI MINT)       |
| Back End Lead        | Oddball | Pronking Springboks: Scrum Team 2 (CMMI MINT)       |
| Front End Engineer   | Oddball | Pronking Springboks: Scrum Team 2 (CMMI MINT)       |


### Leadership Team
Our Leadership Team currently consists of: 
- Program Manager/Delivery Manager 
- Product Manager
- Tech Lead 
- UX Lead

As a whole, the Leadership team functions to decide upon the overall direction of the team as it relates to major product decisions, team process decisions, and customer interactions. We meet weekly to discuss these decisions and surface any issues that need to be worked through. We also present to OIT leadership monthly to summarize progress and elicit feedback to then bring back to the team to help define future work.

- Program Manager - Ensure contract deliverables are being met and that the program is well-supported.
- Product Manager - Ensure that the customers are getting the product that they need. 
- Tech Lead - Manage the technical products at a high level as well as the engineers who are contributing to that product.
- UX Lead - Manage the usability and appearance of the products at a high level as well as anyone who is designing the product.

We have also identified a frontend lead and a backend lead who serve as resources to the team, but are not formally part of the leadership team. They are much more focused on the technical decisions about the products than on how the team operates. They are very involved in sprint planning, creating stories, and presenting completed work, but less involved in the overall direction of the program than the leadership team. While they are still mostly designated to one of our two teams, they attend most meetings for both teams and provide support to both teams.

### Scrum Teams

#### Low-key Glorious Porpoises (MINT Team)
6 plus the leadership team

- UX Designer
- 2 backend engineers 
- 1 frontend engineer
- 1 frontend lead
- 1 backend lead
- 1 devops Engineer 

The team has developed the MINT product for CMMI from the ground up. This application manages the payment model intake process. The team is building out the MVP of this product and currently working towards getting an ATO to be able to deploy it to production.

#### Pronking Springboks (EASi Team)
5 plus the leadership team

- 2 backend engineers
- 2 frontend engineers
- 1 devsecops engineer

The team has been maintaining and building new functionality into the EASi application since the start of the program. The team meets with users to design new features, builds those features and supports them.
