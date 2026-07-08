Vz = window.Vz || {};
$ = $ || jQuery;

Vz.Widgets = Vz.Widgets || {};

Vz.Widgets.Modal = (function (that) {

    that.show = function ($el, oOpt) {
        var nTimeoutId,
            sMsg = oOpt.msg,
            sPos = oOpt.position || 'right',
            nTimeOut = oOpt.hideTime || 5000,
            nWidth = oOpt.width || 220,
            fnHide,
            bAutoHide = oOpt.autoHide || true;

        if (sPos === 'auto') {
            sPos = ($(window).width() - $el.offset().left - $el.width() > nWidth) ? 'right' : 'bottom';
        }

        fnHide = function () {
            if (bAutoHide) {
                clearTimeout(nTimeoutId);
            }
            $el.popover('hide');
        };

        $el.popover('destroy');

        $el.popover($.extend(oOpt, {
            html: true,
            placement: sPos,
            trigger: 'manual',
            animation: true,
            content: sMsg
        })).popover('show');

        if (bAutoHide) {
            nTimeoutId = setTimeout(function () {
                $el.popover('hide');
            }, nTimeOut);
        }

        $el.one("focus keypress change").focus(function () {
            fnHide();
        });
    };

    that.hoverShow = function (oEl, oOpt) {
        oEl.hover(function () {
            that.show(oEl, oOpt);
        }, function () {
            oEl.popover("hide");
        });
    };

    return that;
}(Vz.Widgets.Modal || {}));

Vz.Widgets.TCO = function (config) {
    var self = this;
    self.element = config.oElement;
    self.$el = $(self.element);
    self.testing = !!self.element.getAttribute('data-testing');
    self.baseUrl = self.element.getAttribute('data-base-url') || window.location.protocol + '//' + window.location.host + '/';
    self.bShowForm = self.element.getAttribute('data-form') || false;
    self.bShowBanner = self.element.getAttribute('data-banner') || false;
    self.sButtonLink = self.element.getAttribute('data-button-link') || 'https://www.virtuozzo.com/tco-calculator/';
    self.sButtonText = self.element.getAttribute('data-button-text') || 'TALK TO AN EXPERT';

    self.customCfg = {
        amortization: 1,
        socketsPerServer: 2,
        powerKw: 0.4,
        pue: 1.45,
        electricityRate: 0.12,
        rackFeePerServer: 80,
        rackAnnualCost: 27750,
        serversPerRack: 48,
        internetMbps: 400,
        internetRate: 0.5,
        fteCost: 140000,
        vmwCoreRate: 29.1667,
        vmwMinCores: 72,
        vmwStoragePerCore: 1,
        awsOdRate: 2.4192,
        awsReservedDiscount: 0.5473,
        awsVcpuPerCore: 2,
        awsVcpuPerVm: 48,
        awsEbsRate: 0.08,
        awsGlacierRate: 0.004,
        awsGlacierRead: 0.03,
        awsReadRate: 0.1,
        awsEgressPerVmGb: 3240,
        awsEgressColdPct: 0.1,
        awsMinSupport: 60000
    };

    self.vzModel = {
        edge: {
            pricing: { hardware: 27000, colo: 7687, people: 35000, license: 16674 },
            hot: 27, compute: 3, storage: 0, cpu: 144
        },
        hci: {
            pricing: { hardware: 196423, colo: 11212, people: 35000, license: 36288 },
            hot: 138, cold: 518, compute: 5, storage: 0, cpu: 240
        },
        saas: {
            pricing: { hardware: 366667, colo: 74096, people: 96600, license: 120103 },
            hot: 276, compute: 40, storage: 0, cpu: 1920
        },
        storage: {
            pricing: { hardware: 234243, colo: 58836, people: 63000, license: 126282 },
            hot: 17, cold: 10080, compute: 5, storage: 10, cpu: 480
        },
    };

    self.vmwareModel = {
        edge: {
            pricing: { hardware: 27000, colo: 7687, people: 70000, license: 75600 },
            hot: 21
        },
        hci: {
            pricing: { hardware: 196423, colo: 11212, people: 70000, license: 126000 },
            hot: 107
        },
        saas: {
            pricing: { hardware: 366667, colo: 74096, people: 161000, license: 1008000 },
            hot: 215
        },
        storage: {
            pricing: { hardware: 234243, colo: 58836, people: 154000, license: 226000 },
            hot: 13, cold: 7840
        },
    };

    self.awsModel = {
        edge: {
            pricing: { compute: 57562, hot: 24140, cold: 0, egrees: 20443, cloud: 42000, support: 60000 },
            hot: 27
        },
        hci: {
            pricing: { compute: 95937, hot: 123596, cold: 40555, egrees: 77601, cloud: 42000, support: 60000 },
            hot: 138, cold: 518
        },
        saas: {
            pricing: { compute: 767496, hot: 247192, cold: 0, egrees: 202214, cloud: 112000, support: 121690 },
            hot: 276,
        },
        storage: {
            pricing: { compute: 191874, hot: 15449, cold: 788567, egrees: 648837, cloud: 56000, support: 164473 },
            hot: 17, cold: 10080
        }
    };

    self.signupErrors = {
        UNKNOWN: "Something went wrong. We suspect this was caused by network issues, so please try again in a few minutes. If your second attempt fails, please, email us at <a href='mailto:support.portal.issues@virtuozzo.com'>support.portal.issues@virtuozzo.com</a> to get the assistance with account creation.",
        EMAIL_EXISTS: "A user already exists with that email address",
        ERROR_EMAIL: "The specified email address is not allowed for registration. Please use another email or contact us at <a href='mailto:support.portal.issues@virtuozzo.com'>support.portal.issues@virtuozzo.com</a> for the assistance.",
        EMAIL_DENY: "The specified email address is not allowed for registration.<br>Please use another email or contact us at <a href='mailto:support.portal.issues@virtuozzo.com'>support.portal.issues@virtuozzo.com</a> for the assistance."
    };

    self.getEcEfficiency = function (text) {
        if (!text) return 0;
        if (/replication/i.test(text)) return 1 / 3;
        var m = text.match(/(\d+)\+(\d+)/);
        return m ? parseInt(m[1]) / (parseInt(m[1]) + parseInt(m[2])) : 0;
    };

    self.vzCoreTier = function (cores) {
        if (cores <= 200) return 9.4;
        if (cores <= 250) return 8.8;
        if (cores <= 500) return 7.9;
        if (cores <= 1000) return 6.2;
        if (cores <= 99999) return 5.0;
        return 4.0;
    };

    self.vzStorageTier = function (tb) {
        if (tb <= 500) return 1.33;
        if (tb <= 1000) return 1.25;
        if (tb <= 2000) return 0.84;
        if (tb <= 5000) return 0.75;
        if (tb <= 99999) return 0.60;
        return 0.43;
    };

    self.calcStaffing = function (servers, baseFte, incSmall, incLarge) {
        var C = self.customCfg;
        return C.fteCost * (
            baseFte
            + Math.floor(Math.max(Math.min(servers, 20) - 5, 0) / 5) * incSmall
            + Math.floor(Math.max(servers - 20, 0) / 7) * incLarge
        );
    };

    self.setActiveRadio = function ($elements, fnCallback) {
        $elements.on('change', function () {
            var $input = $(this);
            $input.parent().parent().find('.active').removeClass('active');
            $input.parent().parent().find('[id="vz-' + $input.attr('value') + '"]').addClass('active');
            if (typeof fnCallback === 'function') {
                fnCallback.call(this, $input);
            }
        });
    };

    self.formatUSD = function (n) {
        return '$' + Math.round(n).toLocaleString('en-US');
    };

    self.calculating = function () {

        var competitor = 0;
        var vz = 0;
        var tco_saving = 0;
        var annual_saving = 0;
        var vzStorageTb = 0;
        var competitorStorageTb = 0;

        if (self.vzPrice !== 'custom') {
            vz = (
                    +self.vzModel[self.vzPrice].pricing.hardware +
                    +self.vzModel[self.vzPrice].pricing.colo +
                    +self.vzModel[self.vzPrice].pricing.people +
                    +self.vzModel[self.vzPrice].pricing.license) *
                self.period;

            if (self.competitorPrice === 'vmware-price') {
                competitor = (
                        +self.vmwareModel[self.vzPrice].pricing.hardware +
                        +self.vmwareModel[self.vzPrice].pricing.colo +
                        +self.vmwareModel[self.vzPrice].pricing.people +
                        +self.vmwareModel[self.vzPrice].pricing.license) *
                    self.period;
            }

            if (self.competitorPrice === 'aws-price') {
                competitor = (
                        +self.awsModel[self.vzPrice].pricing.compute +
                        +self.awsModel[self.vzPrice].pricing.hot +
                        +self.awsModel[self.vzPrice].pricing.cold +
                        +self.awsModel[self.vzPrice].pricing.egrees +
                        +self.awsModel[self.vzPrice].pricing.cloud +
                        +self.awsModel[self.vzPrice].pricing.support) *
                    self.period;
            }

            if (self.competitorPrice === 'custom-price') {
                var coldPricePerTb = parseFloat(self.coldStoragePerTbInput.val()) || 0;

                var license = (+self.vzModel[self.vzPrice].compute * self.computeNodeInput.val()) +
                    (+self.vzModel[self.vzPrice].storage * self.storageNodeInput.val());

                if (self.vzPrice === 'hci' && self.competitor === 'aws') {
                    license += self.awsModel.hci.cold * coldPricePerTb;
                }

                if (self.competitor === 'vmware') {
                    competitor =
                        +self.vmwareModel[self.vzPrice].pricing.hardware +
                        +self.vmwareModel[self.vzPrice].pricing.colo +
                        +self.vmwareModel[self.vzPrice].pricing.people;
                }

                if (self.competitor === 'aws') {
                    competitor =
                        +self.awsModel[self.vzPrice].pricing.hot +
                        +self.awsModel[self.vzPrice].pricing.egrees +
                        +self.awsModel[self.vzPrice].pricing.cloud +
                        +self.awsModel[self.vzPrice].pricing.support;
                }

                if (license !== 0) {
                    competitor = (competitor + license) * self.period;
                } else {
                    competitor = 0;
                }
            }

            // More Storage: HCI и custom — только hot; остальные — hot + cold
            if (self.vzPrice === 'hci') {
                vzStorageTb = +self.vzModel.hci.hot || 0;
                competitorStorageTb = self.competitor === 'vmware'
                    ? +self.vmwareModel.hci.hot || 0
                    : +self.awsModel.hci.hot || 0;
            } else {
                vzStorageTb = (+self.vzModel[self.vzPrice].hot || 0) + (+self.vzModel[self.vzPrice].cold || 0);
                if (self.competitor === 'vmware') {
                    competitorStorageTb = (+self.vmwareModel[self.vzPrice].hot || 0) + (+self.vmwareModel[self.vzPrice].cold || 0);
                } else {
                    competitorStorageTb = (+self.awsModel[self.vzPrice].hot || 0) + (+self.awsModel[self.vzPrice].cold || 0);
                }
            }

        } else {
            var C = self.customCfg;

            var computeNodes = parseInt(self.$customComputeNodes.val()) || 0;
            var coresPerCpu = parseInt(self.$customComputeCpu.val()) || 0;
            var hotPerNode = parseFloat(self.$customHotStorage.val()) || 0;
            var hotSchemeText = self.$hotSchemeSelect.find('option:selected').text();
            var storageNodes = parseInt(self.$customStorageNodes.val()) || 0;
            var storageCores = parseInt(self.$customStorageCpu.val()) || 0;
            var coldPerNode = parseFloat(self.$customColdStorage.val()) || 0;
            var coldSchemeText = self.$coldSchemeSelect.find('option:selected').text();

            if (!computeNodes && !storageNodes) {
                vz = 0;
                competitor = 0;
            } else {
                var totalServers = computeNodes + storageNodes;

                var billedCores = computeNodes * C.socketsPerServer * coresPerCpu
                    + storageNodes * storageCores;

                var hotEff = self.getEcEfficiency(hotSchemeText);
                var hotUsableTb = computeNodes * hotPerNode * hotEff * 0.9;
                var vmwareHotUsableTb = computeNodes * hotPerNode * hotEff * 0.7;

                var coldEff = self.getEcEfficiency(coldSchemeText);
                var coldUsableTb = storageNodes * coldPerNode * coldEff * 0.9;

                var vzHotRounded     = Math.round(hotUsableTb);
                var vmwareHotRounded = Math.round(vmwareHotUsableTb);
                var coldRounded      = Math.round(coldUsableTb);

                self.$el.find('.virtuozzo-hot').text(self.numberFormat.format(vzHotRounded));
                self.$el.find('.virtuozzo-cold').text(self.numberFormat.format(coldRounded));
                self.$el.find('.vmware-hot').text(self.numberFormat.format(vmwareHotRounded));
                self.$el.find('.vmware-cold').text(0);
                self.$el.find('.aws-hot').text(self.numberFormat.format(vzHotRounded));
                self.$el.find('.aws-cold').text(self.numberFormat.format(coldRounded));

                if (coldRounded === 0) {
                    self.$el.find('.aws-cold').parent().addClass('sr-only');
                    self.$el.find('.virtuozzo-cold').parent().addClass('sr-only');
                } else {
                    self.$el.find('.aws-cold').parent().removeClass('sr-only');
                    self.$el.find('.virtuozzo-cold').parent().removeClass('sr-only');
                }

                var totalUsableTb = hotUsableTb + coldUsableTb;

                var colo = totalServers * (C.powerKw * C.pue * C.electricityRate * 730 + C.rackFeePerServer) * 12
                    + (totalServers / C.serversPerRack) * C.rackAnnualCost / C.amortization
                    + C.internetMbps * C.internetRate * 12;

                var vzStaff = self.calcStaffing(totalServers, 0.25, 0.10, 0.07);
                var vzLic = self.vzCoreTier(billedCores) * billedCores * 12
                    + self.vzStorageTier(totalUsableTb) * totalUsableTb * 12;

                vz = colo + vzStaff + vzLic;

                if (self.competitorPrice === 'vmware-price') {
                    var vmwStaff = self.calcStaffing(totalServers, 0.50, 0.15, 0.10);
                    var vmwCoresPerServer = Math.max(C.socketsPerServer * coresPerCpu, C.vmwMinCores);
                    var vmwLic = computeNodes * vmwCoresPerServer * C.vmwCoreRate * 12;
                    var vmwIncluded = computeNodes * vmwCoresPerServer * C.vmwStoragePerCore;
                    var vmwOverage = Math.ceil(Math.max(hotUsableTb - vmwIncluded, 0));
                    vmwLic += vmwOverage * C.vmwCoreRate * 12;
                    competitor = colo + vmwStaff + vmwLic;
                }

                if (self.competitorPrice === 'aws-price') {
                    var vmCount = Math.ceil(billedCores * C.awsVcpuPerCore / C.awsVcpuPerVm);
                    var awsCompute = vmCount * C.awsOdRate * (1 - C.awsReservedDiscount) * 730 * 12;
                    var awsHot = hotUsableTb * 931.32 * C.awsEbsRate * 12;
                    var awsCold = coldUsableTb * 931.32 * (C.awsGlacierRate + C.awsReadRate * C.awsGlacierRead) * 12;

                    var egressGb = vmCount * C.awsEgressPerVmGb + coldUsableTb * 931.32 * C.awsEgressColdPct;
                    var awsEgressMo;
                    if (egressGb <= 10240) {
                        awsEgressMo = egressGb * 0.09;
                    } else if (egressGb <= 51200) {
                        awsEgressMo = 10240 * 0.09 + (egressGb - 10240) * 0.085;
                    } else if (egressGb <= 153600) {
                        awsEgressMo = 10240 * 0.09 + 40960 * 0.085 + (egressGb - 51200) * 0.07;
                    } else {
                        awsEgressMo = 10240 * 0.09 + 40960 * 0.085 + 102400 * 0.07 + (egressGb - 153600) * 0.05;
                    }

                    var awsFte = Math.min(0.8, Math.max(0.3, 0.3 + (vmCount - 10) / 70 * 0.5)) * C.fteCost;

                    var monthlyBase = (awsCompute + awsHot + awsCold) / 12 + awsEgressMo;
                    var awsSupport;
                    if (monthlyBase <= 150000) {
                        awsSupport = Math.max(C.awsMinSupport / 12, monthlyBase * 0.10) * 12;
                    } else if (monthlyBase <= 500000) {
                        awsSupport = (150000 * 0.10 + (monthlyBase - 150000) * 0.07) * 12;
                    } else if (monthlyBase <= 1000000) {
                        awsSupport = (150000 * 0.10 + 350000 * 0.07 + (monthlyBase - 500000) * 0.05) * 12;
                    } else {
                        awsSupport = (150000 * 0.10 + 350000 * 0.07 + 500000 * 0.05 + (monthlyBase - 1000000) * 0.03) * 12;
                    }

                    competitor = awsCompute + awsHot + awsCold + awsEgressMo * 12 + awsFte + awsSupport;
                }

                if (self.competitorPrice === 'custom-price') {
                    var nodeAnnual = parseFloat(self.computeNodeInput.val()) || 0;
                    var storageAnnual = parseFloat(self.storageNodeInput.val()) || 0;
                    var coldPricePerTb = parseFloat(self.coldStoragePerTbInput.val()) || 0;
                    competitor = computeNodes * nodeAnnual + storageNodes * storageAnnual + coldUsableTb * coldPricePerTb;
                }

                // Custom: сравниваем только hot (как в HCI)
                vzStorageTb = hotUsableTb;
                competitorStorageTb = self.competitor === 'vmware' ? vmwareHotUsableTb : hotUsableTb;
            }
        }

        if (competitor - vz > 0) {
            annual_saving = (competitor - vz).toFixed(0);
        }
        tco_saving = competitor ? ((annual_saving / competitor) * 100).toFixed(0) : 0;

        var moreStorage = competitorStorageTb > 0
            ? Math.round((vzStorageTb - competitorStorageTb) / competitorStorageTb * 100)
            : 0;

        $(self.element).find('#annual-result').text(self.formatUSD(annual_saving));
        $(self.element).find('#tco-result').text(tco_saving + '%');
        $(self.element).find('#competitor-result').text(self.formatUSD(competitor));
        $(self.element).find('#virtuozzo-result').text(self.formatUSD(vz));
        $(self.element).find('#storage-result').text(moreStorage + '%');
        $(self.element).find('.calc-results').toggleClass('with-storage', moreStorage > 0);
    };

    self.isValidEmailStrong = function (email) {
        var pattern = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])$/i;
        return pattern.test(email);
    };

    self.isGoodEmail = function (email) {
        if (/(gmail)\.com$/.test(email)) {
            return false;
        }
        return true;
    };

    self.isFieldValid = function (field, type) {
        var isValid = true;

        if (type === 'email') {
            if (!self.isValidEmailStrong(field.val())) {
                isValid = false;
                Vz.Widgets.Modal.show(field, { msg: 'The e-mail value is not valid', position: 'bottom' });
                return isValid;
            }
            if (!self.isGoodEmail(field.val())) {
                isValid = false;
                Vz.Widgets.Modal.show(field, { msg: 'Please enter a valid business email address', position: 'bottom' });
                return isValid;
            }
        }

        if (type === 'checkbox') {
            if (field.is(':checked') === false) {
                isValid = false;
                Vz.Widgets.Modal.show(field.parent().find('span'), { msg: 'This field is required', position: 'bottom' });
                return isValid;
            }
        }

        if (field.val().trim().length < 2) {
            isValid = false;
            Vz.Widgets.Modal.show(field, { msg: 'This field is required', position: 'bottom' });
        }

        return isValid;
    };

    self.buildCalcInfo = function () {
        var setupMap = {
            'edge':    'Edge Deployment',
            'hci':     'HCI Baseline',
            'saas':    'SaaS-optimized',
            'storage': 'Storage-optimized',
            'custom':  'Custom setup'
        };
        var priceMap = {
            'vmware-price': 'Estimated VMware',
            'aws-price':    'Estimated AWS',
            'custom-price': 'Custom price'
        };

        var $el        = self.$el;
        var setupVal   = $el.find('[name="vz-price"]:checked').val();
        var priceVal   = $el.find('[name="competitor-price"]:checked').val();
        var setup      = setupMap[setupVal] || '';
        var competitor = $el.find('[name="competitor"]:checked').val() === 'aws' ? 'AWS' : 'VMware';
        var priceType  = priceMap[priceVal] || '';
        var savings    = $el.find('#tco-result').text() || '0%';

        var parts = [setup];

        if (setupVal === 'custom') {
            var cNodes = $el.find('[name="custom-compute-nodes"]').val() || '0';
            var cCores = $el.find('[name="custom-compute-cpu"]').val()   || '0';
            var hotTb  = $el.find('[name="custom-hot-storage"]').val()   || '0';
            var hotEc  = ($el.find('#custom-hot-scheme option:selected').text().trim() || '—').split(' —')[0];
            var sNodes = $el.find('[name="custom-storage-nodes"]').val() || '0';
            var sCores = $el.find('[name="custom-storage-cpu"]').val()   || '0';
            var coldTb = $el.find('[name="custom-cold-storage"]').val()  || '0';
            var coldEc = ($el.find('#custom-cold-scheme option:selected').text().trim() || '—').split(' —')[0];

            parts.push(
                'Compute: ' + cNodes + ' nodes / ' + cCores + ' cores / ' + hotTb + ' TB hot / ' + hotEc,
                'Storage: ' + sNodes + ' nodes / ' + sCores + ' cores / ' + coldTb + ' TB cold / ' + coldEc
            );
        }

        parts.push(competitor, priceType);

        if (priceVal === 'custom-price') {
            var computePrice = $el.find('[name="compute-node-price"]').val() || '0';
            var storagePrice = $el.find('[name="storage-node-price"]').val() || '0';
            var coldTbPrice  = $el.find('[name="storage-cold-storage-price-per-tb"]').val() || '0';

            var priceParts = [
                'Compute node price: $' + computePrice + '/yr',
                'Storage node price: $' + storagePrice + '/yr'
            ];

            if (setupVal === 'hci' && competitor === 'AWS' && coldTbPrice !== '0') {
                priceParts.push('Cold storage: $' + coldTbPrice + '/TB/yr');
            }

            parts.push(priceParts.join(', '));
        }

        parts.push(savings + ' savings');

        return parts.join(' | ');
    };

    self.trackSalesForce = function () {
        if (!self.testing) {
            $(self.element).addClass('loading');

            var $form = $(self.element).find('form');
            var $calcInfo = $form.find('[name="calc_info"]');
            $calcInfo.val(self.buildCalcInfo());

            $.ajax({
                url: 'https://mprocessing.virtuozzo.com/tco-calculator/sign-up.php',
                headers: {
                    'X-vz-0VYe+zINV0qhfJw': 'X-Check'
                },
                type: "POST",
                data: {
                    data: $form.serialize()
                },
                success: function (response) {
                    $(self.element).removeClass('loading');
                    var $response = JSON.parse(response);
                    if ($response.code === 0) {
                        $(self.element).addClass('success');
                        $(self.element).find('.tco-calc-cta').removeClass('active');
                        var $wrapper = $(self.element).find('.tco-form-wrapper');
                        $wrapper.find('input:not([type=submit],[type=hidden]), textarea').val('');
                        $wrapper.find('select').prop('selectedIndex', 0);
                        $wrapper.find('input[type=checkbox], input[type=radio]').prop('checked', false);

                        $('html, body').animate({
                            scrollTop: $('.tco-calculator').offset().top - 150
                        }, 500);

                        setTimeout(function () {
                            $(self.element).removeClass('success');
                        }, 3000);
                    } else {
                        $(self.element).find('[name=email]').focus();
                        Vz.Widgets.Modal.show($(self.element).find('[name=email]'), {
                            msg: 'Please enter a valid business email address',
                            position: 'bottom'
                        });
                    }
                }
            });
        }
    };

    self.submit = function () {
        if (!self.isFieldValid($(self.element).find('[name="firstName"]'), '')) return false;
        if (!self.isFieldValid($(self.element).find('[name="lastName"]'), ''))  return false;
        if (!self.isFieldValid($(self.element).find('[name="email"]'), 'email')) return false;
        if (!self.isFieldValid($(self.element).find('[name="user_job"]'), ''))  return false;
        if (!self.isFieldValid($(self.element).find('[name="company"]'), ''))   return false;
        if (!self.isFieldValid($(self.element).find('[name="country"]'), ''))   return false;
        if (!self.isFieldValid($(self.element).find('[name="terms"]'), 'checkbox')) return false;
        self.trackSalesForce();
    };

    self.showTB = function () {
        var vzHot      = $(self.element).find('.virtuozzo-hot');
        var vzCold     = $(self.element).find('.virtuozzo-cold');
        var vmwareHot  = $(self.element).find('.vmware-hot');
        var vmwareCold = $(self.element).find('.vmware-cold');
        var awsHot     = $(self.element).find('.aws-hot');
        var awsCold    = $(self.element).find('.aws-cold');

        if (self.vzPrice !== 'custom') {

            vzHot.text(self.numberFormat.format(self.vzModel[self.vzPrice].hot));
            if (self.vzModel[self.vzPrice].cold !== undefined) {
                vzCold.text(self.numberFormat.format(self.vzModel[self.vzPrice].cold));
                vzCold.closest('.counting').removeClass('sr-only');
            } else {
                vzCold.closest('.counting').addClass('sr-only');
            }

            vmwareHot.text(self.numberFormat.format(self.vmwareModel[self.vzPrice].hot));
            if (self.vmwareModel[self.vzPrice].cold !== undefined) {
                vmwareCold.text(self.numberFormat.format(self.vmwareModel[self.vzPrice].cold));
                vmwareCold.closest('.counting').removeClass('sr-only');
            } else {
                vmwareCold.closest('.counting').addClass('sr-only');
            }

            awsHot.text(self.numberFormat.format(self.awsModel[self.vzPrice].hot));
            if (self.awsModel[self.vzPrice].cold !== undefined) {
                awsCold.text(self.numberFormat.format(self.awsModel[self.vzPrice].cold));
                awsCold.closest('.counting').removeClass('sr-only');
            } else {
                awsCold.closest('.counting').addClass('sr-only');
            }

        } else {
            $(self.element).find('.counting').removeClass('sr-only');
            vmwareCold.closest('.counting').addClass('sr-only');
            vzHot.text(0);
            vzCold.text(0);
            vmwareHot.text(0);
            vmwareCold.text(0);
            awsHot.text(0);
            awsCold.text(0);
            self.calculating();
        }
    };

    self.initPolicySelect = function ($input, $select) {
        var userChose = false;
        var hasAvailable = false;
        var $placeholder = $select.find('.placeholder');

        var allOptions = [];
        $select.find('option:not(.placeholder)').each(function () {
            allOptions.push({
                min:  parseInt($(this).data('min'), 10),
                text: $(this).text()
            });
            $(this).remove();
        });

        var $msg = $('<span class="scheme-hint">Enter at least 3 nodes to view available erasure coding schemes.</span>');
        $select.wrap('<span class="scheme-select-wrapper"></span>');
        $select.after($msg);

        $select.on('mousedown focus', function () {
            if (!hasAvailable) $msg.show();
        });

        $select.on('blur', function () {
            $msg.hide();
        });

        $select.on('change', function () {
            userChose = true;
            $msg.hide();
        });

        function filterOptions(n) {
            var currentVal = $select.val();
            hasAvailable = false;

            $select.find('option:not(.placeholder)').remove();

            allOptions.forEach(function (opt) {
                if (n >= opt.min) {
                    var $opt = $('<option>').text(opt.text).attr('data-min', opt.min);
                    $select.append($opt);
                    hasAvailable = true;
                }
            });

            if (!hasAvailable) {
                $placeholder.show();
                $select.val('');
                userChose = false;
            } else {
                $placeholder.hide();
                $msg.hide();

                var stillValid = $select.find('option').filter(function () {
                    return $(this).text() === currentVal || $(this).val() === currentVal;
                }).length > 0;

                if (!userChose || !stillValid || $select.val() === '') {
                    $select.find('option:not(.placeholder)').last().prop('selected', true);
                    userChose = false;
                } else {
                    $select.val(currentVal);
                }
            }
        }

        $input.on('input', function () {
            filterOptions(parseInt($(this).val(), 10) || 0);
        });

        filterOptions(parseInt($input.val(), 10) || 0);
    };

    self.render = function () {
        var sHtml = new EJS({ url: self.baseUrl + 'vz-tco-calculator/partial/widget' }).render({
            sBaseUrl: self.baseUrl,
            bShowForm: self.bShowForm,
            bShowBanner: self.bShowBanner,
            sButtonLink: self.sButtonLink,
            sButtonText: self.sButtonText,
        });
        self.$el.append(sHtml);

        self.bindElements();
        self.bindEvents();
        self.initStaticContent();

        self.showTB();
        self.calculating();
        self.$el.removeClass('loading');
    };

    self.bindElements = function () {
        self.period       = 1;
        self.numberFormat = new Intl.NumberFormat('en-US');

        self.vzPrice         = self.$el.find('[name="vz-price"]:checked').val();
        self.competitor      = self.$el.find('[name="competitor"]:checked').val();
        self.competitorPrice = self.$el.find('[name="competitor-price"]:checked').val();

        self.computeNodeInput      = self.$el.find('[name="compute-node-price"]');
        self.storageNodeInput      = self.$el.find('[name="storage-node-price"]');
        self.coldStoragePerTbInput = self.$el.find('[name="storage-cold-storage-price-per-tb"]');

        self.$customComputeNodes = self.$el.find('[name="custom-compute-nodes"]');
        self.$customComputeCpu   = self.$el.find('[name="custom-compute-cpu"]');
        self.$customHotStorage   = self.$el.find('[name="custom-hot-storage"]');
        self.$hotSchemeSelect    = self.$el.find('#custom-hot-scheme');

        self.$customStorageNodes = self.$el.find('[name="custom-storage-nodes"]');
        self.$customStorageCpu   = self.$el.find('[name="custom-storage-cpu"]');
        self.$customColdStorage  = self.$el.find('[name="custom-cold-storage"]');
        self.$coldSchemeSelect   = self.$el.find('#custom-cold-scheme');
    };

    self.bindEvents = function () {
        self.setActiveRadio(self.$el.find('[name="vz-price"]'), function ($input) {
            self.vzPrice = $input.val();

            var $competitors = self.$el.find('.tco-calc-competitors');
            $competitors
                .toggleClass('edge',    self.vzPrice === 'edge')
                .toggleClass('storage', self.vzPrice === 'storage')
                .toggleClass('hci',     self.vzPrice === 'hci')
                .toggleClass('custom',  self.vzPrice === 'custom');

            if (self.vzPrice !== 'storage') {
                self.storageNodeInput.val(0);
            }

            self.calculating();
            self.showTB();
        });

        self.setActiveRadio(self.$el.find('[name="competitor"]'), function ($input) {
            self.competitor = $input.val();
            var $target = self.$el.find('[name="competitor-price"]');

            self.$el.find('.tco-calc-competitors')
                .toggleClass('aws',    self.competitor === 'aws')
                .toggleClass('vmware', self.competitor === 'vmware');

            if (self.competitor === 'vmware') {
                $target.first().trigger('click');
            } else {
                $target.eq(1).trigger('click');
            }
        });

        self.setActiveRadio(self.$el.find('[name="competitor-price"]'), function ($input) {
            self.competitorPrice = $input.val();
            self.calculating();
        });

        self.$el.find('.tco-check').on('click', function (e) {
            e.preventDefault();
            var anchor = $(this).attr('id').replace('vz-', '');
            $(this).parent().find('[value=' + anchor + ']').trigger('click');
        });

        self.$el.find('.tco-btn').on('click', function (e) {
            e.preventDefault();
            var anchor = $(this).attr('id').replace('vz-', '');
            self.$el.find('.competitor-name').text($(this).text());
            $(this).closest('.tco-calc-competitors').find('.competitor-price.show').removeClass('show');
            $(this).closest('.tco-calc-competitors').find('.competitor-' + anchor).addClass('show');
            $(this).parent().find('[value=' + anchor + ']').trigger('click');
        });

        self.$el.find('#open-form').on('click', function (e) {
            e.preventDefault();
            $(this).closest('.tco-calc-block').addClass('active');
        });

        self.$el.find('.close-form').on('click', function () {
            $(this).closest('.tco-calc-block').removeClass('active');
        });

        self.$el.find('#tco-calculator-form').on('submit', function (e) {
            e.preventDefault();
            self.submit();
            return false;
        });

        self.storageNodeInput.add(self.computeNodeInput).on('input', function () {
            var value = Number(this.value) || 0;
            if (value < 0) { this.value = 0; return; }
            self.calculating();
        });

        self.coldStoragePerTbInput.on('input', function () {
            self.calculating();
        });

        self.$el.find('#vz-custom input[type="number"]').on('keydown', function (e) {
            var allowed = [8, 9, 35, 36, 37, 38, 39, 40, 46];
            var isDigit = (e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105);
            if (!isDigit && allowed.indexOf(e.keyCode) === -1) {
                e.preventDefault();
            }
        }).on('paste', function (e) {
            var pasted = (e.originalEvent.clipboardData || window.clipboardData).getData('text');
            if (!/^\d+$/.test(pasted)) e.preventDefault();
        });

        self.$el.find('[name="custom-compute-cpu"], [name="custom-hot-storage"], [name="custom-storage-cpu"], [name="custom-cold-storage"]')
            .on('input', function () { self.calculating(); });

        self.$hotSchemeSelect.add(self.$coldSchemeSelect).on('change', function () {
            self.calculating();
        });

        self.initPolicySelect(self.$customComputeNodes, self.$hotSchemeSelect);
        self.initPolicySelect(self.$customStorageNodes, self.$coldSchemeSelect);
    };

    self.initStaticContent = function () {
        self.$el.find('.edge-nodes').text(self.numberFormat.format(+self.vzModel.edge.compute    + +self.vzModel.edge.storage));
        self.$el.find('.edge-cpu').text(self.numberFormat.format(+self.vzModel.edge.cpu));
        self.$el.find('.hci-nodes').text(self.numberFormat.format(+self.vzModel.hci.compute      + +self.vzModel.hci.storage));
        self.$el.find('.hci-cpu').text(self.numberFormat.format(+self.vzModel.hci.cpu));
        self.$el.find('.saas-nodes').text(self.numberFormat.format(+self.vzModel.saas.compute    + +self.vzModel.saas.storage));
        self.$el.find('.saas-cpu').text(self.numberFormat.format(+self.vzModel.saas.cpu));
        self.$el.find('.storage-nodes').text(self.numberFormat.format(+self.vzModel.storage.compute + +self.vzModel.storage.storage));
        self.$el.find('.storage-cpu').text(self.numberFormat.format(+self.vzModel.storage.cpu));
    };

    if (self.element) {
        if (self.testing) {
            self.pardotTracking = false;
        }
        self.render();

    } else {
        throw new Error('Oops! Something was wrong!');
    }
};

jQuery(document).ready(function ($) {
    var $TCO = $('.vz-tco-calculator'),
        $oTCOwidgets = [];

    if ($TCO.length > 0) {
        $.each($TCO, function (index) {
            this.classList.add('loading');
            var oAtts = { oElement: this };
            $oTCOwidgets[index] = new Vz.Widgets.TCO(oAtts);
        });
    }
});