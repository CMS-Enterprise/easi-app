// Code generated by go-swagger; DO NOT EDIT.

package client

// This file was generated by the swagger tool.
// Editing this file might prove futile when you re-run the swagger generate command

import (
	"github.com/go-openapi/runtime"
	httptransport "github.com/go-openapi/runtime/client"
	"github.com/go-openapi/strfmt"

	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/authority_to_operate"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/budget"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/budget_system_cost"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/component"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/contract"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/cost_type"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/data_center"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/deployment"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/domain_model"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/enumeration"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/exchange"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/organization"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/person"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/role"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/software_products"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/stakeholder"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/support_contact"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/system"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/threat"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/url"
	"github.com/cms-enterprise/easi-app/pkg/cedar/core/gen/client/user"
)

// Default c e d a r core API HTTP client.
var Default = NewHTTPClient(nil)

const (
	// DefaultHost is the default Host
	// found in Meta (info) section of spec file
	DefaultHost string = "webmethods-apigw.cedar.cms.gov"
	// DefaultBasePath is the default BasePath
	// found in Meta (info) section of spec file
	DefaultBasePath string = "/gateway/CEDAR Core API/2.0.0"
)

// DefaultSchemes are the default schemes found in Meta (info) section of spec file
var DefaultSchemes = []string{"https"}

// NewHTTPClient creates a new c e d a r core API HTTP client.
func NewHTTPClient(formats strfmt.Registry) *CEDARCoreAPI {
	return NewHTTPClientWithConfig(formats, nil)
}

// NewHTTPClientWithConfig creates a new c e d a r core API HTTP client,
// using a customizable transport config.
func NewHTTPClientWithConfig(formats strfmt.Registry, cfg *TransportConfig) *CEDARCoreAPI {
	// ensure nullable parameters have default
	if cfg == nil {
		cfg = DefaultTransportConfig()
	}

	// create transport and client
	transport := httptransport.New(cfg.Host, cfg.BasePath, cfg.Schemes)
	return New(transport, formats)
}

// New creates a new c e d a r core API client
func New(transport runtime.ClientTransport, formats strfmt.Registry) *CEDARCoreAPI {
	// ensure nullable parameters have default
	if formats == nil {
		formats = strfmt.Default
	}

	cli := new(CEDARCoreAPI)
	cli.Transport = transport
	cli.AuthorityToOperate = authority_to_operate.New(transport, formats)
	cli.Budget = budget.New(transport, formats)
	cli.BudgetSystemCost = budget_system_cost.New(transport, formats)
	cli.Component = component.New(transport, formats)
	cli.Contract = contract.New(transport, formats)
	cli.CostType = cost_type.New(transport, formats)
	cli.DataCenter = data_center.New(transport, formats)
	cli.Deployment = deployment.New(transport, formats)
	cli.DomainModel = domain_model.New(transport, formats)
	cli.Enumeration = enumeration.New(transport, formats)
	cli.Exchange = exchange.New(transport, formats)
	cli.Organization = organization.New(transport, formats)
	cli.Person = person.New(transport, formats)
	cli.Role = role.New(transport, formats)
	cli.SoftwareProducts = software_products.New(transport, formats)
	cli.Stakeholder = stakeholder.New(transport, formats)
	cli.SupportContact = support_contact.New(transport, formats)
	cli.System = system.New(transport, formats)
	cli.Threat = threat.New(transport, formats)
	cli.URL = url.New(transport, formats)
	cli.User = user.New(transport, formats)
	return cli
}

// DefaultTransportConfig creates a TransportConfig with the
// default settings taken from the meta section of the spec file.
func DefaultTransportConfig() *TransportConfig {
	return &TransportConfig{
		Host:     DefaultHost,
		BasePath: DefaultBasePath,
		Schemes:  DefaultSchemes,
	}
}

// TransportConfig contains the transport related info,
// found in the meta section of the spec file.
type TransportConfig struct {
	Host     string
	BasePath string
	Schemes  []string
}

// WithHost overrides the default host,
// provided by the meta section of the spec file.
func (cfg *TransportConfig) WithHost(host string) *TransportConfig {
	cfg.Host = host
	return cfg
}

// WithBasePath overrides the default basePath,
// provided by the meta section of the spec file.
func (cfg *TransportConfig) WithBasePath(basePath string) *TransportConfig {
	cfg.BasePath = basePath
	return cfg
}

// WithSchemes overrides the default schemes,
// provided by the meta section of the spec file.
func (cfg *TransportConfig) WithSchemes(schemes []string) *TransportConfig {
	cfg.Schemes = schemes
	return cfg
}

// CEDARCoreAPI is a client for c e d a r core API
type CEDARCoreAPI struct {
	AuthorityToOperate authority_to_operate.ClientService

	Budget budget.ClientService

	BudgetSystemCost budget_system_cost.ClientService

	Component component.ClientService

	Contract contract.ClientService

	CostType cost_type.ClientService

	DataCenter data_center.ClientService

	Deployment deployment.ClientService

	DomainModel domain_model.ClientService

	Enumeration enumeration.ClientService

	Exchange exchange.ClientService

	Organization organization.ClientService

	Person person.ClientService

	Role role.ClientService

	SoftwareProducts software_products.ClientService

	Stakeholder stakeholder.ClientService

	SupportContact support_contact.ClientService

	System system.ClientService

	Threat threat.ClientService

	URL url.ClientService

	User user.ClientService

	Transport runtime.ClientTransport
}

// SetTransport changes the transport on the client and all its subresources
func (c *CEDARCoreAPI) SetTransport(transport runtime.ClientTransport) {
	c.Transport = transport
	c.AuthorityToOperate.SetTransport(transport)
	c.Budget.SetTransport(transport)
	c.BudgetSystemCost.SetTransport(transport)
	c.Component.SetTransport(transport)
	c.Contract.SetTransport(transport)
	c.CostType.SetTransport(transport)
	c.DataCenter.SetTransport(transport)
	c.Deployment.SetTransport(transport)
	c.DomainModel.SetTransport(transport)
	c.Enumeration.SetTransport(transport)
	c.Exchange.SetTransport(transport)
	c.Organization.SetTransport(transport)
	c.Person.SetTransport(transport)
	c.Role.SetTransport(transport)
	c.SoftwareProducts.SetTransport(transport)
	c.Stakeholder.SetTransport(transport)
	c.SupportContact.SetTransport(transport)
	c.System.SetTransport(transport)
	c.Threat.SetTransport(transport)
	c.URL.SetTransport(transport)
	c.User.SetTransport(transport)
}
