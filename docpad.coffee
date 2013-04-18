# DocPad Configuration
docpadConfig = {

    # Reload Paths
    # An array of special paths that when changes occur in, we reload our configuration
    reloadPaths: []  # default

    # Regenerate Paths
    # An array of special paths that when changes occur in, we regenerate our website
    regeneratePaths: []  # default

    # Regenerate Delay
    # The time (in milliseconds) to wait after a source file has
    # changed before using it to regenerate. Updating over the
    # network (e.g. via FTP) can cause a page to be partially
    # rendered as the page is regenerated *before* the source file
    # has completed updating: in this case increase this value.
    regenerateDelay: 50 #100    # default

    # Out Path
    # Where should we put our generated website files?
    # If it is a relative path, it will have the resolved `rootPath` prepended to it
    outPath: 'out'  # default

    # Documents Paths
    # An array of paths which contents will be treated as documents
    # If it is a relative path, it will have the resolved `srcPath` prepended to it
    documentsPaths: [  # default
        'documents'
        '_'
    ]

    # Files Paths
    # An array of paths which contents will be treated as files
    # If it is a relative path, it will have the resolved `srcPath` prepended to it
    filesPaths: [  # default
        'files'
        'public'
    ]

    # Layouts Paths
    # An array of paths which contents will be treated as layouts
    # If it is a relative path, it will have the resolved `srcPath` prepended to it
    layoutsPaths: [  # default
        'layouts'
    ]

    # Ignore Paths
    # Can be set to an array of absolute paths that we should ignore from the scanning process
    ignorePaths: [  # default
        'assets/js/headtrackr/*'
        'assets/js/headtrackr'
        '_/assets/js/headtrackr'
        'src/_/assets/js/headtrackr'
        '/assets/js/headtrackr'
        '/_/assets/js/headtrackr'
        '/src/_/assets/js/headtrackr'
    ]

    # Ignore Hidden Files
    # Whether or not we should ignore files that start with a dot from the scanning process
    ignoreHiddenFiles: true

    # Ignore Custom Patterns
    # Can be set to a regex of custom patterns to ignore from the scanning process
    ignoreCustomPatterns: false  # default


    # =================================
    # Server Configuration

    # Port
    # Use to change the port that DocPad listens to
    # By default we will detect the appropriate port number for our environment
    # if no environment port number is detected we will use 9778 as the port number
    # Checked environment variables are:
    # - PORT - Heroku, Nodejitsu, Custom
    # - VCAP_APP_PORT - AppFog
    # - VMC_APP_PORT - CloudFoundry
    port: null  # default

    # Max Age
    # The default caching time limit that is sent with the response to the client
    # Can be set to `false` to disable caching
    maxAge: false #86400000   # default


    # =================================
    # Logging Configuration

    # Log Level
    # Up to which level of logging should we output
    logLevel: (if ('-d' in process.argv) then 7 else 6)  # default

    # Logger
    #  The caterpillar instance that we want to use
    # If not set, we will create our own
    logger: null  # default

    # Growl
    # Whether or not we should display system notifications as things progress within DocPad
    growl: false  # default

    # Catch Exceptions
    # Whether or not DocPad should catch uncaught exceptions
    catchExceptions: true  # default

    # Report Errors
    # Whether or not we should report errors back to the DocPad Team
    reportErrors: process.argv.join('').indexOf('test') is -1  # default (don't enable if we are running inside a test)

    # Report Statistics
    # Whether or not we should report statistics back to the DocPad Team
    reportStatistics: process.argv.join('').indexOf('test') is -1  # default (don't enable if we are running inside a test)

    # Airbrake Token
    # The airbrake token we should use for reporting errors
    # By default, uses the DocPad Team's token
    airbrakeToken: null  # default

    # MixPanel Token
    # The mixpanel token we should use for reporting statistics
    # By default, uses the DocPad Team's token
    mixpanelToken: null  # default


    # =================================
    # Other Configuration

    # Welcome
    # Whether or not we should display any custom welcome callbacks
    welcome: false  # default

    # Prompts
    # Whether or not we should display any prompts
    prompts: false  # default

    # Collections
    # A hash of functions that create collections
    collections:
        experiments: ->
            @getCollection('documents').findAllLive({relativeOutDirPath:'lab'})
        logs: ->
            @getCollection('documents').findAllLive({relativeOutDirPath:'logs'})
        posts: ->
            @getCollection('documents').findAllLive({relativeOutDirPath:'posts'})

    # Regenerate Every
    # Performs a regenerate every x milliseconds, useful for always having the latest data
    regenerateEvery: false  # default


    # =================================
    # Template Configuration

    # Template Data
    # Use to define your own template data and helpers that will be accessible to your templates
    # Complete listing of default values can be found here: http://docpad.org/docs/template-data
    templateData:  # example

        # Site properties
        site:
            # The production url of our website
            url: "http://www.sevastos.com"

            # The default title of our website
            title: "A place"

            # The website description
            description: """
                Paralog log by a strange stranger
                """
                # Fighting the box

        # Styling
        meta:
            css: ['assets/css/app.css']
            js: [
                '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js',
                'assets/js/headtrackr/headtrackr.js',
                'assets/js/app.js'
            ]


        # -----------------------------
        # Helper Functions
        # Get the prepared site/document title
        # Often we would like to specify particular formatting to our page's title
        # we can apply that formatting here
        getPreparedTitle: ->
            # if we have a document title, then we should use that and suffix the site's title onto it
            if @document.title
                "#{@document.title} | #{@site.title}"
            # if our document does not have it's own title, then we should just use the site's title
            else
                @site.title

        # Get the prepared site/document description
        getPreparedDescription: ->
            # if we have a document description, then we should use that, otherwise use the site's description
            @document.description or @site.description

        # Get the prepared site/document keywords
        getPreparedKeywords: ->
            # Merge the document keywords with the site keywords
            @site.keywords.concat(@document.keywords or []).join(', ')



    # =================================
    # Plugin Configuration

    # Configure Plugins
    # Should contain the plugin short names on the left, and the configuration to pass the plugin on the right
    plugins:
        cleanurls:
            enabled: false

        sass:
            outputStyle: 'expanded'


    # =================================
    # Environment Configuration

    # Environment
    # Which environment we should load up
    # If not set, we will default the `NODE_ENV` environment variable, if that isn't set, we will default to `development`
    env: null  # default

    # Environments
    # Allows us to set custom configuration for specific environments
    environments:  # default
        development:  # default
            # Always refresh from server
            maxAge: false  # default

            # Only do these if we are running standalone via the `docpad` executable
            checkVersion: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default
            welcome: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default
            prompts: process.argv.length >= 2 and /docpad$/.test(process.argv[1])  # default

            # Listen to port 9005 on the development environment
            port: 9005  # example
}

# Export the DocPad Configuration
module.exports = docpadConfig
