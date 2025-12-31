{{- define "sample-app.name" -}}
{{- default .Chart.Name .Values.microservice.name | trimSuffix "-" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "sample-app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "sample-app.labels" -}}
helm.sh/chart: {{ include "sample-app.chart" . }}
{{ include "sample-app.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
microservice: {{ .Values.microservice.name }}
environment: {{ .Values.microservice.environment }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "sample-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "sample-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
microservice: {{ .Values.microservice.name }}
environment: {{ .Values.microservice.environment }}
{{- end }}

{{/*
Ingress annotations
*/}}
{{- define "sample-app.ingress.annotations" -}}

external-dns.alpha.kubernetes.io/hostname: {{ .Values.ingress.host }}

{{/*
Use Let's Encrypt ACME for any Ingress Controller which is no AWS ALB (Since in ALB we use the AWS ACM Certificate)
*/}}
{{- if .Values.ingress.protocol | eq "https" }}
cert-manager.io/cluster-issuer: letsencrypt-prod
kubernetes.io/tls-acme: 'true'
{{- end }}

{{/*
Annotation for NGINX Ingress Controller
*/}}
{{- if and (.Values.ingress.protocol | eq "https") (.Values.ingress.ingressClassName | eq "nginx") }}
nginx.ingress.kubernetes.io/force-ssl-redirect: 'true'
{{- end }}

{{/*
Whether the ALB listens on HTTP or HTTPS (In case of HTTPS it redirects HTTP traffic to HTTPS)
*/}}
{{- if .Values.ingress.protocol | eq "https" }}
alb.ingress.kubernetes.io/listen-ports: '[{"HTTP":80}, {"HTTPS":443}]'
alb.ingress.kubernetes.io/ssl-redirect: '443'
{{- else }}
alb.ingress.kubernetes.io/listen-ports: '[{"HTTP":80}]'
{{- end }}
{{- end }}

{{- define "sample-app.ingressClassName" -}}
{{- default "nginx" .Values.ingress.ingressClassName }}
{{- end }}