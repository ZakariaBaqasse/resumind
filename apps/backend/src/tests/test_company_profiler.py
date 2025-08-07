import asyncio
from langfuse.langchain import CallbackHandler
from langchain_core.runnables import RunnableConfig
from langgraph.graph.state import CompiledStateGraph
from langgraph.checkpoint.memory import InMemorySaver

from src.job_applications.agents.company_profiler_agents.company_profiler import (
    CompanyProfilerAgent,
    CompanyProfilerState,
)

from src.job_applications.agents.company_profiler_agents.company_discovery_agent import (
    CompanyDiscoveryAgent,
    CompanyDiscoveryAgentState,
)

from src.job_applications.agents.company_profiler_agents.research_executor_agent import (
    ResearchExecutor,
    ResearchExecutorState,
)

from src.job_applications.types import (
    ResearchCategory,
    DiscoveredCompanyProfile,
    DiscoveryConfidence,
    KeyProperties,
    CompanyCharacteristics,
    CompanySizeEstimate,
    CompanyType,
    ResearchContext,
    InformationAvailability,
    WebPresenceQuality,
    ResearchDifficulty,
)


TEST_COMPANY_NAME = "Lumenalta"
TEST_JOB_ROLE = "Javascript Fullstack Engineer - Senior"
TEST_JOB_DESCRIPTION = """
With over 20 years of fully remote experience, Lumenalta offers:

Fully remote work
Rapid growth opportunities
Self-Improvement
Industry-leading clients
Nurturing engineers’ career paths


What You Will Work On

Collaborate with visionary enterprise clients
Create transformative digital products
Learn how to handle difficult situations
Tackle complex challenges at scale
Push boundaries with emerging technologies


Requirements

Expertise in React, Node, Express, Mongo, SQL
We have a 2-hour assessment
High-level English proficiency (written & verbal)
Show up as a proactive, team-oriented self-starter on Zoom


Why Lumenalta?

Work on meaningful, impactful projects.
Collaborate with a talented, supportive team
Enjoy a flexible, remote-first environment
Join a company that values your growth


If you’re a passionate, career-focused developer ready to make a lasting impact, we want to hear from you!
"""


def test_company_profiler_agent():
    company_profiler_agent = CompanyProfilerAgent()
    graph: CompiledStateGraph = company_profiler_agent.build_graph()
    configurable = {
        "thread_id": "123",
    }
    config = RunnableConfig(callbacks=[CallbackHandler()], configurable=configurable)
    state = CompanyProfilerState(
        job_role=TEST_JOB_ROLE,
        job_description=TEST_JOB_DESCRIPTION,
        company=TEST_COMPANY_NAME,
    )
    result = asyncio.run(graph.ainvoke(input=state, config=config))
    assert result


def test_company_discovery_agent():
    company_discovery_agent = CompanyDiscoveryAgent()
    graph: CompiledStateGraph = company_discovery_agent.build_graph()
    configurable = {
        "thread_id": "123",
    }
    config = RunnableConfig(callbacks=[CallbackHandler()], configurable=configurable)
    state = CompanyDiscoveryAgentState(
        company_name=TEST_COMPANY_NAME,
        job_role=TEST_JOB_ROLE,
        job_description=TEST_JOB_DESCRIPTION,
        messages=[],
    )
    result = asyncio.run(graph.ainvoke(input=state, config=config))
    assert result


test_company_discovery_results = DiscoveredCompanyProfile(
    company_name="Lumenalta",
    official_website="https://lumenalta.com/",
    discovery_confidence=DiscoveryConfidence.HIGH,
    key_properties=KeyProperties(
        careers_page="https://lumenalta.com/careers",
        engineering_blog=None,
        about_page="https://lumenalta.com/about",
        contact_page="https://lumenalta.com/contact",
    ),
    company_characteristics=CompanyCharacteristics(
        industry_sector="IT Services and IT Consulting",
        company_size_estimate=CompanySizeEstimate.LARGE,
        company_type=CompanyType.PRIVATE,
    ),
    research_context=ResearchContext(
        information_availability=InformationAvailability.HIGH,
        web_presence_quality=WebPresenceQuality.PROFESSIONAL,
        research_difficulty=ResearchDifficulty.EASY,
    ),
    linkedin_company_page="https://www.linkedin.com/company/lumenalta",
    additional_verified_urls=["https://www.linkedin.com/company/lumenalta"],
    discovery_notes="Lumenalta has a strong digital presence with a professional website and active LinkedIn profile. The company appears to be well-established in the IT services and consulting sector, with a focus on digital transformation solutions. Information about the company is readily available and consistent across multiple sources.",
    sources_consulted=[
        '"Lumenalta" official website',
        "Lumenalta company size employees",
    ],
)

test_category_1 = ResearchCategory(
    category_name="company_mission_and_values",
    description="Understanding Lumenalta's core mission and values to align the candidate's application with the company's culture and goals.",
    priority=4,
    data_points=[
        "Company mission statement",
        "Core values and principles",
        "Company culture and work environment",
    ],
)


test_category_2 = ResearchCategory(
    category_name="tech_stack_and_practices",
    description="Detailed technical architecture and development practices, leveraging the company's engineering blog and comprehensive careers page.",
    priority=5,
    data_points=[
        "Programming languages and frameworks used (check engineering blog posts and careers page)",
        "Development methodology and team practices (careers page technical requirements)",
        "Infrastructure and deployment practices",
        "Code quality and testing approaches",
    ],
)

test_category_3 = ResearchCategory(
    category_name="client_projects_and_impact",
    description="Insight into the types of projects Lumenalta undertakes and their impact on clients, highlighting the significance of the work.",
    priority=3,
    data_points=[
        "Notable client projects",
        "Case studies and success stories",
        "Client industries served",
        "Impact metrics and outcomes",
    ],
)

test_category_4 = ResearchCategory(
    category_name="team_structure_and_collaboration",
    description="Understanding the team dynamics and collaboration practices at Lumenalta, especially in a remote work environment.",
    priority=4,
    data_points=[
        "Team composition and roles",
        "Collaboration tools and practices",
        "Communication protocols",
        "Remote work policies and support",
    ],
)

test_category_5 = ResearchCategory(
    category_name="growth_opportunities",
    description="Exploring the growth opportunities and career development programs offered by Lumenalta.",
    priority=2,
    data_points=[
        "Career development programs",
        "Training and certification opportunities",
        "Promotion and advancement paths",
        "Mentorship and coaching programs",
    ],
)

test_category_6 = ResearchCategory(
    category_name="company_leadership_and_vision",
    description="Insight into the leadership team and their vision for the future of Lumenalta.",
    priority=3,
    data_points=[
        "Key leaders and their backgrounds",
        "Strategic vision and future goals",
        "Innovation and technology roadmap",
        "Market positioning and competitive advantage",
    ],
    rationale="The research categories were chosen based on the high information availability and professional web presence of Lumenalta. The company's strong digital footprint allows for a detailed and specific research plan. The categories focus on understanding the company's mission, technical practices, client impact, team dynamics, growth opportunities, and leadership vision. This comprehensive approach ensures that the candidate can tailor their application to align with Lumenalta's values, technical requirements, and cultural environment, maximizing the effectiveness of the resume customization.",
)


def test_research_executor_agent():
    research_executor = ResearchExecutor()
    graph: CompiledStateGraph = research_executor.build_graph()
    configurable = {
        "thread_id": "123",
    }
    config = RunnableConfig(callbacks=[CallbackHandler()], configurable=configurable)
    state = ResearchExecutorState(
        company=TEST_COMPANY_NAME,
        job_role=TEST_JOB_ROLE,
        messages=[],
        company_discovery_results=test_company_discovery_results,
        research_category=test_category_1,
    )
    result = asyncio.run(graph.ainvoke(input=state, config=config))
    assert result
